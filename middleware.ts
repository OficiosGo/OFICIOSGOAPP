import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const AUTH_ROUTES = ["/app/login", "/login", "/registro"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let user: { id: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = { id: payload.sub as string, role: payload.role as string };
    } catch {
      if (pathname.startsWith("/app/dashboard") || pathname.startsWith("/admin")) {
        const response = NextResponse.redirect(new URL("/app/cuenta", request.url));
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
    }
  }

  // Logged in user going to auth pages → redirect to dashboard
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  // /app/dashboard → only authenticated professionals or admin
  if (pathname.startsWith("/app/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "PROFESSIONAL" && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // /admin → only admin
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
  matcher: ["/app/dashboard/:path*", "/admin/:path*", "/login", "/registro", "/app/login"],
};
