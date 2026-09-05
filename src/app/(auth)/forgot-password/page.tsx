"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import { AuthCard } from "@/components/auth/AuthCard";
import { TextInput } from "@/components/auth/TextInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);

    async function onSubmit(e: ChangeEvent) {
        e.preventDefault();
        setPending(true);
        try {
            await axios.post("/api/auth/forgot-password", { email });
            setSent(true);
        } catch {
            // The API always returns 200 here - a network/500 error is the only
            // failure case worth surfacing.
            toast.error("Something went wrong, please try again");
        } finally {
            setPending(false);
        }
    }

    return (
        <AuthCard title="Forgot your password?" subtitle="We'll email you a reset link">
            {sent ? (
                <p className="text-sm text-zinc-400">
                    If that email exists, we&apos;ve sent a password reset link. Check your inbox.
                </p>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <TextInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <SubmitButton pending={pending}>Send reset link</SubmitButton>
                </form>
            )}
            <p className="mt-6 text-center text-sm text-zinc-400">
                <Link href="/login" className="text-brand-cyan hover:underline">
                    Back to login
                </Link>
            </p>
        </AuthCard>
    );
}
