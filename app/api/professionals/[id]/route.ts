import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/api-handler";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { AppError } from "@/lib/errors";

export const GET = withErrorHandling(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  // Try by slug first, then by ID
  let profile = await professionalRepository.getBySlug(id);
  if (!profile) {
    profile = await professionalRepository.getById(id);
  }
  if (!profile) throw AppError.notFound("Profesional");

  // Track view
  await professionalRepository.incrementViews(profile.id).catch(() => {});

  return NextResponse.json({ data: profile });
});
