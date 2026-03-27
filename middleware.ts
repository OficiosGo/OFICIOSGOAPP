import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const AUTH_ROUTES = ["/app/login", "/login", "/registro", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let user: { id: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = { id: payload.sub as string, role: payload.role as string };
    } catch {
      if (pathname.startsWith("/app/dashboard") || pathname.startsWith("/app/cuenta/editar") || pathname.startsWith("/admin")) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  // Logged in user going to auth pages
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    // Allow forgot/reset even when logged in
    if (pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
      return NextResponse.next();
    }
    // Admin can access /registro
    if (pathname === "/registro" && user.role === "ADMIN") {
      return NextResponse.next();
    }
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (user.role === "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/app/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // /app/dashboard — only professionals
  if (pathname.startsWith("/app/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (user.role !== "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // /app/cuenta sub-pages — need auth
  if (pathname.startsWith("/app/cuenta/editar") || pathname.startsWith("/app/cuenta/fotos") || pathname.startsWith("/app/cuenta/opiniones") || pathname.startsWith("/app/cuenta/estadisticas")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // /admin — only admin
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/dashboard/:path*",
    "/app/cuenta/editar",
    "/app/cuenta/fotos",
    "/app/cuenta/opiniones",
    "/app/cuenta/estadisticas",
    "/admin/:path*",
    "/login",
    "/registro",
    "/app/login",
    "/forgot-password",
    "/reset-password",
  ],
};