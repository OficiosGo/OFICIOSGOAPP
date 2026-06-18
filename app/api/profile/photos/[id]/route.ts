import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";

// DELETE /api/profile/photos/[id] — borra una foto de trabajo propia
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    const photo = await db.workPhoto.findUnique({
      where: { id },
      select: { id: true, url: true, profileId: true },
    });
    // Verificación de propiedad: la foto tiene que ser de este perfil
    if (!photo || photo.profileId !== profile.id) {
      return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
    }

    await db.workPhoto.delete({ where: { id } });

    // Borrar el blob es best-effort: si falla, igual ya quitamos la referencia
    try {
      await del(photo.url);
    } catch (e) {
      console.error("[DELETE photo] blob del failed (non-fatal)", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/profile/photos/[id]]", error);
    return NextResponse.json({ error: "Error al borrar la foto" }, { status: 500 });
  }
}
