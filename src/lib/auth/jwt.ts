import jwt from "jsonwebtoken";

// Two separate secrets/token families on purpose: an access token must never
// be swappable for a verify/reset token even if one secret were to leak.
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const EMAIL_TOKEN_SECRET = process.env.JWT_EMAIL_TOKEN_SECRET!;

export type AccessTokenPayload = { userId: string };

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"],
    });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
        return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
    } catch {
        return null;
    }
}

export type EmailTokenPurpose = "verify" | "reset";

export type EmailTokenPayload = {
    userId: string;
    purpose: EmailTokenPurpose;
    jti: string;
};

export function signEmailToken(
    payload: EmailTokenPayload,
    expiresIn: string
): string {
    return jwt.sign(payload, EMAIL_TOKEN_SECRET, {
        expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });
}

export function verifyEmailToken(token: string): EmailTokenPayload | null {
    try {
        return jwt.verify(token, EMAIL_TOKEN_SECRET) as EmailTokenPayload;
    } catch {
        return null;
    }
}

// Read a token's own `exp` claim so a DB-side expiry mirrors the JWT exactly,
// instead of re-parsing a duration string like "1d" a second time.
export function getTokenExpiry(token: string): Date | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string" || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
}
