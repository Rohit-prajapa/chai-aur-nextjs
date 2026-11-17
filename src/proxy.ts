import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes
  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword" ||
    path === "/resetpassword";

  // Get authentication token
  const token = request.cookies.get("token")?.value || "";

  // Logged-in users should not access login/signup pages
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // Protect profile routes
  if (path.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotpassword",
    "/resetpassword",
    "/profile/:path*",
  ],
};
