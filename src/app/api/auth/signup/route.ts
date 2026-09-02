import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/api/schemas/auth";
import { issueEmailToken } from "@/lib/auth/emailToken";

export const POST = async (request: NextRequest) => {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, error: { message: parsed.error.issues[0]?.message ?? "Invalid input" } },
            { status: 400 }
        );
    }
    const { name, email, password } = parsed.data;

    await connectDB();

    if (await User.exists({ email })) {
        return NextResponse.json(
            { success: false, error: { message: "Email already in use" } },
            { status: 409 }
        );
    }

    const user = await User.create({
        name,
        email,
        password: await hashPassword(password),
        isVerified: false,
    });

    const verifyToken = issueEmailToken(
        user,
        "verify",
        process.env.JWT_VERIFY_EMAIL_EXPIRES_IN ?? "1d"
    );
    await user.save();

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;
    console.log(verifyUrl);

    return NextResponse.json({ success: true, data: { email } }, { status: 201 });
};
