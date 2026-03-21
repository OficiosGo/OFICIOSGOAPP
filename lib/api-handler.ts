import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code, details: error.details },
          { status: error.statusCode }
        );
      }

      console.error(`[API Error] ${request.method} ${request.url}:`, error);
      return NextResponse.json(
        { error: "Error interno del servidor", code: "INTERNAL" },
        { status: 500 }
      );
    }
  };
}
