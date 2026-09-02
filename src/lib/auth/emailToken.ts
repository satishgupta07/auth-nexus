import { randomUUID } from "crypto";
import type { HydratedDocument } from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { User, type IUser } from "@/models/User";
import {
    signEmailToken,
    verifyEmailToken,
    getTokenExpiry,
    type EmailTokenPurpose,
} from "@/lib/auth/jwt";

// Maps a token purpose to the pair of User fields it lives in, so "verify"
// and "reset" can't drift apart on field names between issuing and
// consuming a token.
const TOKEN_FIELDS = {
    verify: { token: "verifyToken", expiry: "verifyTokenExpiry" },
    reset: { token: "forgotPasswordToken", expiry: "forgotPasswordTokenExpiry" },
} as const;

// Mints a one-time JWT for the given purpose and stores its jti + expiry on
// the user document. Caller still owns calling user.save().
export function issueEmailToken(
    user: HydratedDocument<IUser>,
    purpose: EmailTokenPurpose,
    expiresIn: string
): string {
    const jti = randomUUID();
    const token = signEmailToken({ userId: user._id.toString(), purpose, jti }, expiresIn);

    const fields = TOKEN_FIELDS[purpose];
    user.set(fields.token, jti);
    user.set(fields.expiry, getTokenExpiry(token) ?? undefined);

    return token;
}

// Validates a JWT's signature/purpose/expiry *and* re-checks the DB-stored
// jti hasn't already been consumed, then clears it - this combination is
// what makes a verify-email/reset-password link single-use. Returns the
// loaded user (caller applies its own mutation and calls user.save()), or
// null if the token is invalid, expired, or already used.
export async function consumeEmailToken(
    token: string,
    purpose: EmailTokenPurpose
): Promise<HydratedDocument<IUser> | null> {
    const payload = verifyEmailToken(token);
    if (!payload || payload.purpose !== purpose) return null;

    await connectDB();

    const fields = TOKEN_FIELDS[purpose];
    const user = await User.findOne({
        _id: payload.userId,
        [fields.token]: payload.jti,
        [fields.expiry]: { $gt: new Date() },
    }).select(`+${fields.token} +${fields.expiry}`);

    if (!user) return null;

    user.set(fields.token, undefined);
    user.set(fields.expiry, undefined);
    return user;
}
