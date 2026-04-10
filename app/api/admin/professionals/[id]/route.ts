import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withErrorHandling } from "@/lib/api-handler";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";
import { AppError } from "@/lib/errors";

const updateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(15).optional().or(z.literal("")),
  city: z.string().min(2),
  categoryId: z.string().cuid(),
});

export const PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") throw AppError.unauthorized("No autorizado");

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const profile = await db.profile.findUnique({ where: { id }, select: { userId: true } });
  if (!profile) throw AppError.conflict("Profesional no encontrado");

  const { name, email, phone, city, categoryId } = parsed.data;

  const cat = await db.serviceCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!cat) throw AppError.conflict("Categoría inválida");

  const emailTaken = await db.user.findFirst({ where: { email, NOT: { id: profile.userId } }, select: { id: true } });
  if (emailTaken) throw AppError.conflict("Ese email ya está en uso");

  await db.$transaction([
    db.user.update({ where: { id: profile.userId }, data: { name, email, phone: phone || null } }),
    db.profile.update({ where: { id }, data: { city, categoryId, whatsapp: phone || null } }),
  ]);

  return NextResponse.json({ ok: true });
});