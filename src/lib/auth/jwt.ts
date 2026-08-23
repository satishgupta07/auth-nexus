import jwt from "jsonwebtoken";

// Two separate secrets/token families on purpose: an access token must never
// be swappable for a verify/reset token even if one secret were to leak.
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export type AccessTokenPayload = { userId: string };

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"],
    });
}
