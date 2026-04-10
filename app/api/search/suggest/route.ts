import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { categoryRepository } from "@/server/repositories/category.repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ categories: [], professionals: [] });
  }

  try {
    const [allCategories, professionals] = await Promise.all([
      categoryRepository.getAll(),
      db.profile.findMany({
        where: {
          status: "APPROVED",
          user: { isActive: true },
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { headline: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true,
          slug: true,
          profileImage: true,
          tier: true,
          user: { select: { name: true } },
          category: { select: { name: true, icon: true, slug: true } },
        },
        orderBy: [
          { tier: "asc" },
          { averageRating: "desc" },
        ],
        take: 5,
      }),
    ]);

    const qLower = q.toLowerCase();
    const categories = allCategories
      .filter((c) => c.name.toLowerCase().includes(qLower))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        count: c._count.profiles,
      }));

    return NextResponse.json({
      categories,
      professionals: professionals.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.user.name,
        categoryName: p.category.name,
        categoryIcon: p.category.icon,
        profileImage: p.profileImage,
        tier: p.tier,
      })),
    });
  } catch (error) {
    console.error("[/api/search/suggest]", error);
    return NextResponse.json({ categories: [], professionals: [] }, { status: 500 });
  }
}