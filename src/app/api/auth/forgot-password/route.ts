import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { issueEmailToken } from "@/lib/auth/emailToken";
import { sendMail } from "@/lib/mail/sendMail";
import { resetPasswordTemplate } from "@/lib/mail/templates/resetPassword";
import { forgotPasswordSchema } from "@/lib/api/schemas/auth";

const GENERIC_MESSAGE = "If that email exists, we've sent a password reset link";

export const POST = async (request: NextRequest) => {
    const parsed = forgotPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: { message: parsed.error.issues[0]?.message ?? "Invalid input" } },
            { status: 400 }
        );
    }
    const { email } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email });
    // Always the same response whether or not the account exists - only the
    // side effect (sending mail) is conditional.
    if (user) {
        const resetToken = issueEmailToken(
            user,
            "reset",
            process.env.JWT_RESET_PASSWORD_EXPIRES_IN ?? "15m"
        );
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        await sendMail({
            to: email,
            subject: "Reset your password",
            html: resetPasswordTemplate({ resetUrl }),
        });
    }

    return NextResponse.json({ success: true, data: { message: GENERIC_MESSAGE } });
};
