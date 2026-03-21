import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { reviewSchema } from "@/lib/validators";
import { reviewRepository } from "@/server/repositories/review.repository";
import { requireAuth } from "@/server/auth/guards";
import { AppError } from "@/lib/errors";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "profileId requerido", code: "VALIDATION" }, { status: 422 });
  }
  const page = Number(searchParams.get("page") ?? 1);
  const result = await reviewRepository.getByProfileId(profileId, page);
  return NextResponse.json(result);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const user = await requireAuth();
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", code: "VALIDATION", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const existing = await reviewRepository.checkExists(parsed.data.profileId, user.id);
  if (existing) {
    throw AppError.conflict("Ya dejaste una reseña para este profesional");
  }

  const review = await reviewRepository.create({
    profileId: parsed.data.profileId,
    authorId: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  return NextResponse.json({ data: review }, { status: 201 });
});
