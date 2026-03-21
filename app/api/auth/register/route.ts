import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { registerSchema } from "@/lib/validators";
import { authService } from "@/server/services/auth.service";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", code: "VALIDATION", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { token, user } = await authService.register(parsed.data);

  const response = NextResponse.json({ data: user }, { status: 201 });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
});
