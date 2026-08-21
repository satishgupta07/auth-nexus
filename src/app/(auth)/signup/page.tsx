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

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [pending, setPending] = useState(false);

    async function onSubmit(e: ChangeEvent) {
        e.preventDefault();
        setPending(true);
        try {
            await axios.post("/api/auth/signup", form);
            toast.success("Account created! Check your email to verify.");
            router.push("/login");
        } catch (error) {
            toast.error(extractErrorMessage(error, "Signup failed"));
        } finally {
            setPending(false);
        }
    }

    return (
        <AuthCard title="Create your account" subtitle="Join AuthNexus in a few seconds">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <TextInput
                    label="Name"
                    name="name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
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
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                <SubmitButton pending={pending}>Sign up</SubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-cyan hover:underline">
                    Log in
                </Link>
            </p>
        </AuthCard>
    );
}
