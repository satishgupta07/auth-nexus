"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import { AuthCard } from "@/components/auth/AuthCard";
import { extractErrorMessage } from "@/lib/api/clientError";

type Status = "verifying" | "success" | "error";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
    const [message, setMessage] = useState(
        token ? "Verifying your email..." : "Missing verification token."
    );

    useEffect(() => {
        if (!token) return;
        axios
            .post("/api/auth/verify-email", { token })
            .then(() => {
                setStatus("success");
                setMessage("Your email has been verified. You can now log in.");
            })
            .catch((error) => {
                setStatus("error");
                setMessage(extractErrorMessage(error, "Verification failed"));
            });
    }, [token]);

    return (
        <AuthCard title="Email verification">
            <p className="text-sm text-zinc-400">{message}</p>
            {status !== "verifying" && (
                <Link
                    href="/login"
                    className="mt-6 inline-block text-sm font-medium text-brand-cyan hover:underline"
                >
                    Go to login
                </Link>
            )}
        </AuthCard>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
