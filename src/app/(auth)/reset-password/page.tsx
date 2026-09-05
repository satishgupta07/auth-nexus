"use client";

import { Suspense, useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { extractErrorMessage } from "@/lib/api/clientError";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [pending, setPending] = useState(false);

    async function onSubmit(e: ChangeEvent) {
        e.preventDefault();
        if (!token) {
            toast.error("Missing reset token");
            return;
        }
        setPending(true);
        try {
            await axios.post("/api/auth/reset-password", { token, newPassword });
            toast.success("Password updated. Please log in.");
            router.push("/login");
        } catch (error) {
            toast.error(extractErrorMessage(error, "Reset failed"));
        } finally {
            setPending(false);
        }
    }

    return (
        <AuthCard title="Choose a new password" subtitle="Make it at least 8 characters">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <PasswordInput
                    label="New password"
                    name="newPassword"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <SubmitButton pending={pending}>Reset password</SubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-400">
                <Link href="/login" className="text-brand-cyan hover:underline">
                    Back to login
                </Link>
            </p>
        </AuthCard>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordContent />
        </Suspense>
    );
}
