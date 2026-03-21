import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { searchSchema } from "@/lib/validators";
import { searchService } from "@/server/services/search.service";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const parsed = searchSchema.safeParse({
    category: searchParams.get("category"),
    city: searchParams.get("city"),
    query: searchParams.get("q"),
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius") ?? 50,
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? 20,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", code: "VALIDATION" },
      { status: 422 }
    );
  }

  const result = await searchService.search(parsed.data);
  return NextResponse.json(result);
});
