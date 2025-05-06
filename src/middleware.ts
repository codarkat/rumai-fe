import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Các đường dẫn auth không cần token
  const isAuthPath =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/forgot-password" ||
    path.startsWith("/auth/reset-password");

  // Các đường dẫn cần xác thực
  const isProtectedPath =
    path.startsWith("/dictionary") ||
    path.startsWith("/personal") ||
    path.startsWith("/documents") ||
    path.startsWith("/assistant") ||
    path.startsWith("/tests");

  const isAuthenticated = !!req.auth;

  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/personal", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/dictionary/:path*",
    "/personal/:path*",
    "/documents/:path*",
    "/assistant/:path*",
    "/tests/:path*",
  ],
};
