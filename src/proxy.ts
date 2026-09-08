import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, sessionCookieConfig, adminSessionCookieConfig } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/account");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  if (isAdminLogin) {
    return NextResponse.next();
  }

  // Admin and account routes are gated by two entirely separate cookies —
  // an admin session must never grant access to /account, and a customer
  // session must never grant access to /admin.
  const cookieName = isAdminRoute ? adminSessionCookieConfig.name : sessionCookieConfig.name;
  const token = request.cookies.get(cookieName)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL(
      isAdminRoute ? "/admin/login" : "/login",
      request.url,
    );
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
