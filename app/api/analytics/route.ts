import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { page, referrer } = body;

    // TEMPORARY: log only, no DB write.
    // TODO: replace with PlatformEvent model after migration.
    if (process.env.NODE_ENV === "development") {
      console.log("[analytics]", {
        page: typeof page === "string" ? page.slice(0, 200) : "/",
        referrer: typeof referrer === "string" ? referrer.slice(0, 200) : null,
        ua: request.headers.get("user-agent")?.slice(0, 100),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/analytics]", error);
    return NextResponse.json({ ok: true });
  }
}