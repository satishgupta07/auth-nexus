import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/lib/auth/session";
import { verifyAccessToken } from "@/lib/auth/jwt";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_ONLY_PATHS = ["/login", "/signup"];

// Optimistic check only (signature + expiry) - no DB round-trip here, per
// Next's own guidance that Proxy isn't meant for slow data fetching. The
// authoritative check lives in getCurrentUser() on the actual page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const hasValidSession = Boolean(token && verifyAccessToken(token));

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !hasValidSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthOnly && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
