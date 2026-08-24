import { cache } from "react";
import { cookies } from "next/headers";

import { connectDB } from "../db/connect";
import { User } from "@/models/User";
import { verifyAccessToken } from "./jwt";

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

export async function clearAccessTokenCookie(): Promise<void> {
    const store = await cookies();
    store.delete(ACCESS_COOKIE);
}

// cache() dedupes repeated calls within a single request/render pass.
export const getCurrentUser = cache(async () => {
    const store = await cookies();
    const token = store.get(ACCESS_COOKIE)?.value;
    if (!token) return null;

    const payload = verifyAccessToken(token);
    if (!payload) return null;

    await connectDB();
    return User.findById(payload.userId).lean();
});
