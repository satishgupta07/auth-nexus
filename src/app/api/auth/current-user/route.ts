import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json(
            { success: false, error: { message: "Not authenticated" } },
            { status: 401 }
        );
    }

    return NextResponse.json({
        success: true,
        data: { user: { id: user._id, name: user.name, email: user.email } },
    });
}
