import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Belt-and-suspenders on top of proxy.ts's optimistic check - this is the
  // authoritative, DB-backed check.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <>{children}</>;
}
