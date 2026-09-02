import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { setAccessTokenCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/api/schemas/auth";

const invalidCredentials = () =>
    NextResponse.json(
        { success: false, error: { message: "Invalid email or password" } },
        { status: 401 }
    );

export const POST = async (request: NextRequest) => {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: { message: parsed.error.issues[0]?.message ?? "Invalid input" } },
            { status: 400 }
        );
    }
    const { email, password } = parsed.data;

    await connectDB();

    // Same generic message for "no such user" and "wrong password" - never
    // reveal which one it was. .lean() is safe here: we only read fields and
    // never call .save() on this document.
    const user = await User.findOne({ email }).select("+password").lean();
    if (!user) return invalidCredentials();

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) return invalidCredentials();

    if (!user.isVerified) {
        return NextResponse.json(
            { success: false, error: { message: "Please verify your email before logging in" } },
            { status: 403 }
        );
    }

    const token = signAccessToken({ userId: user._id.toString() });
    await setAccessTokenCookie(token);

    return NextResponse.json({
        success: true,
        data: { user: { id: user._id, name: user.name, email: user.email } },
    });
};
