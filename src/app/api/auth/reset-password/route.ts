import { NextRequest, NextResponse } from "next/server";

import { consumeEmailToken } from "@/lib/auth/emailToken";
import { hashPassword } from "@/lib/auth/password";
import { clearAccessTokenCookie } from "@/lib/auth/session";
import { resetPasswordSchema } from "@/lib/api/schemas/auth";

export const POST = async (request: NextRequest) => {
    const parsed = resetPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: { message: parsed.error.issues[0]?.message ?? "Invalid input" } },
            { status: 400 }
        );
    }
    const { token, newPassword } = parsed.data;

    const user = await consumeEmailToken(token, "reset");
    if (!user) {
        return NextResponse.json(
            { success: false, error: { message: "Invalid or expired reset link" } },
            { status: 400 }
        );
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    // Force re-login with the new password rather than leaving any existing
    // session cookie valid.
    await clearAccessTokenCookie();

    return NextResponse.json({ success: true, data: { reset: true } });
};
