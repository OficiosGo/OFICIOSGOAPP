import { NextResponse } from "next/server";
import { searchService } from "@/server/services/search.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const isOn = (v: string | null) => v === "1" || v === "true";

  try {
    const result = await searchService.search({
      category: category || null,
      query: query || null,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 && limit <= 50 ? limit : 20,
      urgencias: isOn(searchParams.get("urgencias")),
      garantia: isOn(searchParams.get("garantia")),
      matriculado: isOn(searchParams.get("matriculado")),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/search]", error);
    return NextResponse.json(
      { data: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      { status: 500 }
    );
  }
}