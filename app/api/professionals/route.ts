import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { searchService } from "@/server/services/search.service";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  if (featured === "true") {
    const data = await searchService.getFeatured(6);
    return NextResponse.json({ data });
  }

  const result = await searchService.search({
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 20),
  });

  return NextResponse.json(result);
});
