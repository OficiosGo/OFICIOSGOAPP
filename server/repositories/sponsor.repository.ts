import { db } from "@/db/client";

export const sponsorRepository = {
  async getActive(city?: string) {
    return db.sponsor.findMany({
      where: {
        isActive: true,
        OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
        ...(city && { city: { equals: city, mode: "insensitive" as const } }),
      },
      orderBy: [{ tier: "asc" }, { createdAt: "desc" }],
    });
  },

  async incrementViews(id: string) {
    await db.sponsor.update({
      where: { id },
      data: { totalViews: { increment: 1 } },
    });
  },

  async incrementClicks(id: string) {
    await db.sponsor.update({
      where: { id },
      data: { totalClicks: { increment: 1 } },
    });
  },
};
