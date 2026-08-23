"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { AuthCard } from "@/components/auth/AuthCard";
import { TextInput } from "@/components/auth/TextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { extractErrorMessage } from "@/lib/api/clientError";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [pending, setPending] = useState(false);

    async function onSubmit(e: ChangeEvent) {
        e.preventDefault();
        setPending(true);
        try {
            await axios.post("/api/auth/login", form);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error) {
            toast.error(extractErrorMessage(error, "Login failed"));
        } finally {
            setPending(false);
        }
    }

    return (
        <AuthCard title="Welcome back" subtitle="Log in to your AuthNexus account">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-xs text-brand-cyan hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <SubmitButton pending={pending}>Log in</SubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-brand-cyan hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthCard>
    );
}
