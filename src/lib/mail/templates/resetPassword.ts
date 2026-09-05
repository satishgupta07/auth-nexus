import { emailShell } from "./shared";

export function resetPasswordTemplate({ resetUrl }: { resetUrl: string }): string {
    return emailShell({
        heading: "Reset your password",
        bodyHtml:
            "We received a request to reset your password. Click the button below to choose a new one. This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.",
        ctaLabel: "Reset password",
        ctaUrl: resetUrl,
    });
}
