import { cookies } from "next/headers";

export const ACCESS_COOKIE = "authnexus_token";

const ACCESS_COOKIE_MAX_AGE_SECONDS = 15 * 60; // matches JWT_ACCESS_EXPIRES_IN default

export async function setAccessTokenCookie(token: string): Promise<void> {
    const store = await cookies();
    store.set(ACCESS_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
    });
}
