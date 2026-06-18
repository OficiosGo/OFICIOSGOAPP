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

  async search(filters: ProfessionalFilters) {
    const { category, city, query, lat, lng, radius = 50, page = 1, limit = 20,
      urgencias, garantia, matriculado } = filters;
    const hasGeo = lat != null && lng != null;

    if (hasGeo) {
      return this.searchWithGeo({ category, city, query, lat: lat!, lng: lng!, radius, page, limit, urgencias, garantia, matriculado });
    }

    const where: Prisma.ProfileWhereInput = {
      status: "APPROVED",
      user: { isActive: true },
      ...(category && { category: { slug: category } }),
      ...(city && { city: { equals: city, mode: "insensitive" } }),
      ...(urgencias && { urgencias24hs: true }),
      ...(garantia && { conGarantia: true }),
      ...(matriculado && { matricula: { not: null } }),
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
          { tier: "desc" },
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

  async searchWithGeo(params: {
    category?: string | null;
    city?: string | null;
    query?: string | null;
    lat: number;
    lng: number;
    radius: number;
    page: number;
    limit: number;
    urgencias?: boolean;
    garantia?: boolean;
    matriculado?: boolean;
  }) {
    const { category, city, query, lat, lng, radius, page, limit, urgencias, garantia, matriculado } = params;
    const offset = (page - 1) * limit;

    const conditions: string[] = [
      `p."status" = 'APPROVED'`,
      `u."isActive" = true`,
      `p."latitude" IS NOT NULL`,
      `p."longitude" IS NOT NULL`,
    ];
    const values: (string | number)[] = [lat, lng, radius, limit, offset];
    let paramIdx = 6;

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

    // Filtros de confianza (constantes, sin input del usuario)
    if (urgencias) conditions.push(`p."urgencias24hs" = true`);
    if (garantia) conditions.push(`p."conGarantia" = true`);
    if (matriculado) conditions.push(`p."matricula" IS NOT NULL`);

    const whereClause = conditions.join(" AND ");

    const distanceExpr = `
      6371 * acos(
        LEAST(1, GREATEST(-1,
          cos(radians($1)) * cos(radians(p."latitude")) *
          cos(radians(p."longitude") - radians($2)) +
          sin(radians($1)) * sin(radians(p."latitude"))
        ))
      )
    `;

    const countResult = await db.$queryRawUnsafe<[{ count: bigint }]>(`
      SELECT COUNT(*)::bigint as count
      FROM "Profile" p
      JOIN "User" u ON u."id" = p."userId"
      JOIN "ServiceCategory" sc ON sc."id" = p."categoryId"
      WHERE ${whereClause}
      AND ${distanceExpr} <= $3
    `, ...values);
    const total = Number(countResult[0]?.count ?? 0);

    const rows = await db.$queryRawUnsafe<Array<{
      id: string; slug: string; headline: string | null; bio: string | null;
      city: string; province: string; latitude: number; longitude: number;
      whatsapp: string | null; yearsExperience: number | null; tier: string;
      averageRating: number; totalReviews: number; totalViews: number;
      totalContacts: number; matricula: string | null; availability: string | null;
      status: string; userId: string; categoryId: string; user_name: string;
      user_phone: string | null; cat_id: string; cat_name: string;
      cat_slug: string; cat_icon: string | null; distance_km: number;
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
        distance_km ASC,
        p."averageRating" DESC
      LIMIT $4 OFFSET $5
    `, ...values);

    const data = rows.map((row) => ({
      id: row.id, slug: row.slug, headline: row.headline, bio: row.bio,
      city: row.city, province: row.province, latitude: row.latitude,
      longitude: row.longitude, whatsapp: row.whatsapp,
      yearsExperience: row.yearsExperience,
      tier: row.tier as "FREE" | "STANDARD" | "PREMIUM",
      averageRating: Number(row.averageRating),
      totalReviews: row.totalReviews, totalViews: row.totalViews,
      totalContacts: row.totalContacts, matricula: row.matricula,
      availability: row.availability, status: row.status,
      userId: row.userId, categoryId: row.categoryId,
      user: { id: row.userId, name: row.user_name, phone: row.user_phone },
      category: { id: row.cat_id, name: row.cat_name, slug: row.cat_slug, icon: row.cat_icon },
      photos: [] as { url: string }[],
      distance: Math.round(Number(row.distance_km) * 10) / 10,
    }));

    if (data.length > 0) {
      const profileIds = data.map((d) => d.id);
      const photos = await db.workPhoto.findMany({
        where: { profileId: { in: profileIds } },
        orderBy: { sortOrder: "asc" },
        take: 3 * data.length,
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

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getByStatus(status: ProfileStatus, page = 1, limit = 20) {
    const where = { status };
    const [results, total] = await Promise.all([
      db.profile.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, dni: true, birthDate: true, createdAt: true } },
          category: { select: { name: true, slug: true, icon: true } },
          photos: { select: { url: true }, take: 3, orderBy: { sortOrder: "asc" as const } },
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
      orderBy: [{ tier: "desc" }, { averageRating: "desc" }],
      take: limit,
    });
  },

  /**
   * Get recent professionals excluding a list of IDs.
   * Used in home "Todos los profesionales" to avoid duplicates with featured section.
   */
  async getRecent(limit = 8, excludeIds: string[] = []) {
    return db.profile.findMany({
      where: {
        status: "APPROVED",
        user: { isActive: true },
        ...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
      },
      include: profileCard,
      orderBy: [
        { tier: "desc" },
        { averageRating: "desc" },
        { createdAt: "desc" },
      ],
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
    urgencias24hs?: boolean;
    conGarantia?: boolean;
    additionalCategories?: string[];
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

  /**
   * Promedio real de la plataforma (solo lectura).
   * Pondera por cantidad de reseñas para que un perfil con 1 reseña 5★
   * no infle el número. Devuelve null si todavía no hay reseñas reales.
   */
  async getPlatformRating() {
    const agg = await db.profile.aggregate({
      where: { status: "APPROVED", user: { isActive: true }, totalReviews: { gt: 0 } },
      _sum: { totalReviews: true },
      _count: { _all: true },
    });

    const totalReviews = agg._sum.totalReviews ?? 0;
    if (!totalReviews || !agg._count._all) return null;

    // Suma ponderada: Σ(averageRating × totalReviews) / Σ(totalReviews)
    const rated = await db.profile.findMany({
      where: { status: "APPROVED", user: { isActive: true }, totalReviews: { gt: 0 } },
      select: { averageRating: true, totalReviews: true },
    });
    const weighted = rated.reduce((acc, p) => acc + p.averageRating * p.totalReviews, 0);
    const avg = weighted / totalReviews;

    return { average: Math.round(avg * 10) / 10, totalReviews };
  },
};