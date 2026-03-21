import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") ?? undefined;
  const sponsors = await sponsorRepository.getActive(city);
  return NextResponse.json({ data: sponsors });
});
