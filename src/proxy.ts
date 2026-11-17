
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/logout";

  const token = request.cookies.get("token")?.value || "";

  // If user is logged in, redirect away from public pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // If user is not logged in, protect profile pages
  if (path.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/logout",
    "/profile/:path*",
  ],
};
