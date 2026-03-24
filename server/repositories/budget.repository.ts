import { db } from "@/db/client";

export const budgetRepository = {
  async create(data: {
    categoryId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    description: string;
    city?: string;
  }) {
    return db.budgetRequest.create({
      data,
      include: { category: true },
    });
  },

  async getById(id: string) {
    return db.budgetRequest.findUnique({
      where: { id },
      include: {
        category: true,
        responses: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  /**
   * Get budget requests relevant to a professional (by their category)
   */
  async getForProfessional(categoryId: string, page = 1, limit = 10) {
    const where = {
      categoryId,
      status: { in: ["PENDING" as const, "ACTIVE" as const] },
    };

    const [results, total] = await Promise.all([
      db.budgetRequest.findMany({
        where,
        include: { category: true, _count: { select: { responses: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.budgetRequest.count({ where }),
    ]);

    return { data: results, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Get all professionals in a category that should be notified
   */
  async getProfessionalsForCategory(categoryId: string) {
    return db.profile.findMany({
      where: {
        categoryId,
        status: "APPROVED",
        user: { isActive: true },
        whatsapp: { not: null },
      },
      select: {
        id: true,
        whatsapp: true,
        user: { select: { name: true } },
      },
    });
  },

  async addResponse(data: {
    budgetRequestId: string;
    profileId: string;
    message?: string;
    amount?: number;
  }) {
    return db.budgetResponse.create({ data });
  },

  async updateStatus(id: string, status: "ACTIVE" | "COMPLETED" | "CANCELLED") {
    return db.budgetRequest.update({
      where: { id },
      data: { status },
    });
  },

  async updateNotifiedCount(id: string, count: number) {
    return db.budgetRequest.update({
      where: { id },
      data: { notifiedCount: count, status: "ACTIVE" },
    });
  },
};