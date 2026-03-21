import { db } from "@/db/client";

export const categoryRepository = {
  async getAll() {
    return db.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            profiles: { where: { status: "APPROVED", user: { isActive: true } } },
          },
        },
      },
    });
  },

  async getBySlug(slug: string) {
    return db.serviceCategory.findUnique({ where: { slug } });
  },

  async getById(id: string) {
    return db.serviceCategory.findUnique({ where: { id } });
  },
};
