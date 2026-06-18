import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";

const MAX_PHOTOS = 12;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

// POST /api/profile/photos — agrega una foto de trabajo al perfil del profesional
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const count = await db.workPhoto.count({ where: { profileId: profile.id } });
    if (count >= MAX_PHOTOS) {
      return NextResponse.json(
        { error: `Máximo ${MAX_PHOTOS} fotos. Borrá alguna para subir otra.` },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });
    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Solo JPG, PNG o WebP" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Máximo 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const blob = await put(`work/${user.id}-${Date.now()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    const photo = await db.workPhoto.create({
      data: { profileId: profile.id, url: blob.url, sortOrder: count },
      select: { id: true, url: true },
    });

    return NextResponse.json({ data: photo }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/profile/photos]", error);
    return NextResponse.json({ error: "Error al subir la foto" }, { status: 500 });
  }
}
