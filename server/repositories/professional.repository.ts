import { db } from "@/db/client";
import type { ProfileStatus, Prisma } from "@prisma/client";
import type { ProfessionalFilters } from "@/types";

const profileWithRelations = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  category: true,
  photos: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProfileInclude;

const profileCard = {
  user: { select: { id: true, name: true, phone: true } },
  category: { select: { id: true, name: true, slug: true, icon: true } },
  photos: { take: 3, orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProfileInclude;

export const professionalRepository = {
  async getById(id: string) {
    return db.profile.findUnique({
      where: { id },
      include: {
        ...profileWithRelations,
        reviews: {
          where: { isVisible: true, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async getBySlug(slug: string) {
    return db.profile.findUnique({
      where: { slug },
      include: {
        ...profileWithRelations,
        reviews: {
          where: { isVisible: true, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
  },

  async getByUserId(userId: string) {
    return db.profile.findUnique({
      where: { userId },
      include: profileWithRelations,
    });
  },

  /**
   * Search with optional geolocation.
   * When lat/lng provided, calculates distance using Haversine in PostgreSQL
   * and returns results sorted by: tier (premium first) → distance.
   */
  async search(filters: ProfessionalFilters) {
    const { category, city, query, lat, lng, radius = 50, page = 1, limit = 20 } = filters;
    const hasGeo = lat != null && lng != null;

    // ── GEO SEARCH: raw SQL with Haversine ──
    if (hasGeo) {
      return this.searchWithGeo({ category, city, query, lat: lat!, lng: lng!, radius, page, limit });
    }

    // ── STANDARD SEARCH: Prisma query ──
    const where: Prisma.ProfileWhereInput = {
      status: "APPROVED",
      user: { isActive: true },
      ...(category && { category: { slug: category } }),
      ...(city && { city: { equals: city, mode: "insensitive" } }),
      ...(query && {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { headline: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      }),
    };

    const [results, total] = await Promise.all([
      db.profile.findMany({
        where,
        include: profileCard,
        orderBy: [
          { tier: "asc" },
          { averageRating: "desc" },
          { totalReviews: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.profile.count({ where }),
    ]);

    return {
      data: results.map((r) => ({ ...r, distance: null as number | null })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Geo search using raw SQL Haversine formula.
   * PostgreSQL calculates distance in km, filters by radius, sorts by tier then distance.
   */
  async searchWithGeo(params: {
    category?: string | null;
    city?: string | null;
    query?: string | null;
    lat: number;
    lng: number;
    radius: number;
    page: number;
    limit: number;
  }) {
    const { category, city, query, lat, lng, radius, page, limit } = params;
    const offset = (page - 1) * limit;

    // Build WHERE clauses dynamically
    const conditions: string[] = [
      `p."status" = 'APPROVED'`,
      `u."isActive" = true`,
      `p."latitude" IS NOT NULL`,
      `p."longitude" IS NOT NULL`,
    ];
    const values: (string | number)[] = [lat, lng, radius, limit, offset];
    let paramIdx = 6; // $1=lat, $2=lng, $3=radius, $4=limit, $5=offset

    if (category) {
      conditions.push(`sc."slug" = $${paramIdx}`);
      values.push(category);
      paramIdx++;
    }
    if (city) {
      conditions.push(`LOWER(p."city") = LOWER($${paramIdx})`);
      values.push(city);
      paramIdx++;
    }
    if (query) {
      conditions.push(`(
        u."name" ILIKE $${paramIdx}
        OR p."headline" ILIKE $${paramIdx}
        OR p."bio" ILIKE $${paramIdx}
        OR sc."name" ILIKE $${paramIdx}
      )`);
      values.push(`%${query}%`);
      paramIdx++;
    }

    const whereClause = conditions.join(" AND ");

    // Haversine formula in PostgreSQL
    const distanceExpr = `
      6371 * acos(
        LEAST(1, GREATEST(-1,
          cos(radians($1)) * cos(radians(p."latitude")) *
          cos(radians(p."longitude") - radians($2)) +
          sin(radians($1)) * sin(radians(p."latitude"))
        ))
      )
    `;

    // Count query
    const countResult = await db.$queryRawUnsafe<[{ count: bigint }]>(`
      SELECT COUNT(*)::bigint as count
      FROM "Profile" p
      JOIN "User" u ON u."id" = p."userId"
      JOIN "ServiceCategory" sc ON sc."id" = p."categoryId"
      WHERE ${whereClause}
      AND ${distanceExpr} <= $3
    `, ...values);
    const total = Number(countResult[0]?.count ?? 0);

    // Main query with distance
    const rows = await db.$queryRawUnsafe<Array<{
      id: string;
      slug: string;
      headline: string | null;
      bio: string | null;
      city: string;
      province: string;
      latitude: number;
      longitude: number;
      whatsapp: string | null;
      yearsExperience: number | null;
      tier: string;
      averageRating: number;
      totalReviews: number;
      totalViews: number;
      totalContacts: number;
      matricula: string | null;
      availability: string | null;
      status: string;
      userId: string;
      categoryId: string;
      user_name: string;
      user_phone: string | null;
      cat_id: string;
      cat_name: string;
      cat_slug: string;
      cat_icon: string | null;
      distance_km: number;
    }>>(`
      SELECT
        p."id", p."slug", p."headline", p."bio", p."city", p."province",
        p."latitude", p."longitude", p."whatsapp", p."yearsExperience",
        p."tier", p."averageRating", p."totalReviews", p."totalViews",
        p."totalContacts", p."matricula", p."availability", p."status",
        p."userId", p."categoryId",
        u."name" as user_name, u."phone" as user_phone,
        sc."id" as cat_id, sc."name" as cat_name, sc."slug" as cat_slug, sc."icon" as cat_icon,
        ${distanceExpr} as distance_km
      FROM "Profile" p
      JOIN "User" u ON u."id" = p."userId"
      JOIN "ServiceCategory" sc ON sc."id" = p."categoryId"
      WHERE ${whereClause}
      AND ${distanceExpr} <= $3
      ORDER BY
        CASE p."tier"
          WHEN 'PREMIUM' THEN 0
          WHEN 'STANDARD' THEN 1
          ELSE 2
        END ASC,
        distance_km ASC
      LIMIT $4 OFFSET $5
    `, ...values);

    // Map raw rows to the same shape as Prisma results
    const data = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      headline: row.headline,
      bio: row.bio,
      city: row.city,
      province: row.province,
      latitude: row.latitude,
      longitude: row.longitude,
      whatsapp: row.whatsapp,
      yearsExperience: row.yearsExperience,
      tier: row.tier as "FREE" | "STANDARD" | "PREMIUM",
      averageRating: Number(row.averageRating),
      totalReviews: row.totalReviews,
      totalViews: row.totalViews,
      totalContacts: row.totalContacts,
      matricula: row.matricula,
      availability: row.availability,
      status: row.status,
      userId: row.userId,
      categoryId: row.categoryId,
      user: { id: row.userId, name: row.user_name, phone: row.user_phone },
      category: { id: row.cat_id, name: row.cat_name, slug: row.cat_slug, icon: row.cat_icon },
      photos: [] as { url: string }[], // Fetched separately below
      distance: Math.round(Number(row.distance_km) * 10) / 10,
    }));

    // Batch fetch photos for all results (1 query instead of N)
    if (data.length > 0) {
      const profileIds = data.map((d) => d.id);
      const photos = await db.workPhoto.findMany({
        where: { profileId: { in: profileIds } },
        orderBy: { sortOrder: "asc" },
        take: 3 * data.length, // max 3 per profile
      });
      const photoMap = new Map<string, { url: string }[]>();
      for (const photo of photos) {
        const existing = photoMap.get(photo.profileId) ?? [];
        if (existing.length < 3) {
          existing.push({ url: photo.url });
          photoMap.set(photo.profileId, existing);
        }
      }
      for (const d of data) {
        d.photos = photoMap.get(d.id) ?? [];
      }
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getByStatus(status: ProfileStatus, page = 1, limit = 20) {
    const where = { status };
    const [results, total] = await Promise.all([
      db.profile.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.profile.count({ where }),
    ]);

    return { data: results, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getFeatured(limit = 6) {
    return db.profile.findMany({
      where: {
        status: "APPROVED",
        user: { isActive: true },
        tier: { in: ["PREMIUM", "STANDARD"] },
      },
      include: profileCard,
      orderBy: [{ tier: "asc" }, { averageRating: "desc" }],
      take: limit,
    });
  },

  async create(data: {
    userId: string;
    slug: string;
    categoryId: string;
    city: string;
    headline?: string;
    bio?: string;
    whatsapp?: string;
    province?: string;
  }) {
    return db.profile.create({ data, include: profileWithRelations });
  },

  async update(id: string, data: Prisma.ProfileUpdateInput) {
    return db.profile.update({ where: { id }, data });
  },

  async incrementViews(profileId: string) {
    await Promise.all([
      db.profile.update({
        where: { id: profileId },
        data: { totalViews: { increment: 1 } },
      }),
      db.profileEvent.create({
        data: { profileId, eventType: "view" },
      }),
    ]);
  },

  async incrementContacts(profileId: string) {
    await Promise.all([
      db.profile.update({
        where: { id: profileId },
        data: { totalContacts: { increment: 1 } },
      }),
      db.profileEvent.create({
        data: { profileId, eventType: "contact" },
      }),
    ]);
  },

  async countAll() {
    return db.profile.count({ where: { status: "APPROVED", user: { isActive: true } } });
  },
};
