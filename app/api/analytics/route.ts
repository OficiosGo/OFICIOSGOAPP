import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";

export async function POST(request: NextRequest) {
  try {
    const { page, referrer } = await request.json();

    await db.profileEvent.create({
      data: {
        profileId: "platform",
        eventType: "page_view",
        metadata: {
          page: page || "/",
          referrer: referrer || null,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}