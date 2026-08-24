import { AuthCard } from "@/components/auth/AuthCard";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    return (
        <AuthCard title={`Welcome, ${user?.name ?? "there"}`} subtitle={user?.email}>
            <LogoutButton />
        </AuthCard>
    );
}
