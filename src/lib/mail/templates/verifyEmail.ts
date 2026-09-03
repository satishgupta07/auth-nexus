import { emailShell } from "./shared";

export function verifyEmailTemplate({ verifyUrl }: { verifyUrl: string }): string {
    return emailShell({
        heading: "Verify your email",
        bodyHtml:
            "Thanks for signing up. Click the button below to verify your email address and activate your account. This link expires in 24 hours.",
        ctaLabel: "Verify email",
        ctaUrl: verifyUrl,
    });
}
