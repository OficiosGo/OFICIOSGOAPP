import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { updateProfileSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const profile = await professionalRepository.getByUserId(user.id);
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());
    const parsed = updateProfileSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: "Datos invalidos", details: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    await professionalRepository.update(profile.id, parsed.data);
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}