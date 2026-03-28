import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const [todayViews, yesterdayViews, weekViews, todayByPage, hourlyToday] = await Promise.all([
    db.profileEvent.count({
      where: { eventType: "page_view", createdAt: { gte: todayStart } },
    }),
    db.profileEvent.count({
      where: { eventType: "page_view", createdAt: { gte: yesterdayStart, lt: todayStart } },
    }),
    db.profileEvent.count({
      where: { eventType: "page_view", createdAt: { gte: weekStart } },
    }),
    db.$queryRaw<Array<{ page: string; count: bigint }>>`
      SELECT metadata->>'page' as page, COUNT(*) as count
      FROM "ProfileEvent"
      WHERE "eventType" = 'page_view' AND "createdAt" >= ${todayStart}
      GROUP BY metadata->>'page'
      ORDER BY count DESC
      LIMIT 10
    `,
    db.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as count
      FROM "ProfileEvent"
      WHERE "eventType" = 'page_view' AND "createdAt" >= ${todayStart}
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour ASC
    `,
  ]);

  return NextResponse.json({
    today: todayViews,
    yesterday: yesterdayViews,
    week: weekViews,
    byPage: todayByPage.map((p) => ({ page: p.page, count: Number(p.count) })),
    hourly: hourlyToday.map((h) => ({ hour: Number(h.hour), count: Number(h.count) })),
  });
}