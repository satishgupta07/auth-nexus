import { NextRequest, NextResponse } from "next/server";

import { consumeEmailToken } from "@/lib/auth/emailToken";

export const POST = async (request: NextRequest) => {
    const { token } = await request.json();
    if (typeof token !== "string" || !token) {
        return NextResponse.json(
            { success: false, error: { message: "Missing token" } },
            { status: 400 }
        );
    }

    const user = await consumeEmailToken(token, "verify");
    if (!user) {
        return NextResponse.json(
            { success: false, error: { message: "Invalid or expired verification link" } },
            { status: 400 }
        );
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json({ success: true, data: { verified: true } });
};
