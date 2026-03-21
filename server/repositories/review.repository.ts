import { db } from "@/db/client";

export const reviewRepository = {
  async getByProfileId(profileId: string, page = 1, limit = 10) {
    const where = { profileId, isVisible: true, deletedAt: null };
    const [results, total] = await Promise.all([
      db.review.findMany({
        where,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
    ]);
    return { data: results, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async create(data: {
    profileId: string;
    authorId: string;
    rating: number;
    comment?: string;
  }) {
    const review = await db.review.create({
      data,
      include: { author: { select: { id: true, name: true } } },
    });

    // Recalculate profile average
    const stats = await db.review.aggregate({
      where: { profileId: data.profileId, isVisible: true, deletedAt: null },
      _avg: { rating: true },
      _count: true,
    });

    await db.profile.update({
      where: { id: data.profileId },
      data: {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count,
      },
    });

    return review;
  },

  async addResponse(reviewId: string, response: string) {
    return db.review.update({
      where: { id: reviewId },
      data: { response, respondedAt: new Date() },
    });
  },

  async checkExists(profileId: string, authorId: string) {
    return db.review.findUnique({
      where: { profileId_authorId: { profileId, authorId } },
    });
  },
};
