import { NextResponse } from "next/server";

import { clearAccessTokenCookie } from "@/lib/auth/session";

export const POST = async () => {
    await clearAccessTokenCookie();
    return NextResponse.json({ success: true, data: { loggedOut: true } });
};
