import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { db } from "@/db/client";
import { z } from "zod";

const publicReviewSchema = z.object({
  profileId: z.string().cuid("Perfil invalido"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  authorName: z.string().min(2, "Minimo 2 caracteres").max(100),
  authorPhone: z.string().min(8, "Telefono invalido").max(15),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = publicReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", code: "VALIDATION", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  let user = await db.user.findFirst({ where: { phone: parsed.data.authorPhone } });

  if (!user) {
    const bcrypt = await import("bcryptjs");
    user = await db.user.create({
      data: {
        email: `guest-${parsed.data.authorPhone}@oficiosgo.local`,
        passwordHash: await bcrypt.hash(Math.random().toString(36), 10),
        name: parsed.data.authorName,
        phone: parsed.data.authorPhone,
        role: "CLIENT",
      },
    });
  }

  const existing = await db.review.findUnique({
    where: { profileId_authorId: { profileId: parsed.data.profileId, authorId: user.id } },
  });

  if (existing) {
    return NextResponse.json({ error: "Ya dejaste una resena para este profesional" }, { status: 409 });
  }

  const review = await db.review.create({
    data: {
      profileId: parsed.data.profileId,
      authorId: user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      isVerified: false,
      isVisible: true,
    },
    include: { author: { select: { name: true } } },
  });

  const stats = await db.review.aggregate({
    where: { profileId: parsed.data.profileId, isVisible: true, deletedAt: null },
    _avg: { rating: true },
    _count: true,
  });

  await db.profile.update({
    where: { id: parsed.data.profileId },
    data: {
      averageRating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
      totalReviews: stats._count,
    },
  });

  return NextResponse.json({ data: review }, { status: 201 });
});