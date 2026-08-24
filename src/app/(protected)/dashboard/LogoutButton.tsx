"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { SubmitButton } from "@/components/auth/SubmitButton";

export function LogoutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onLogout() {
        setPending(true);
        try {
            await axios.post("/api/auth/logout");
            router.push("/login");
        } catch {
            toast.error("Logout failed");
        } finally {
            setPending(false);
        }
    }

    return (
        <SubmitButton type="button" pending={pending} onClick={onLogout}>
            Log out
        </SubmitButton>
    );
}
