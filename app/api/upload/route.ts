import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const contentType = request.headers.get("content-type") || "";
    let imageData: string;

    if (contentType.includes("application/json")) {
      const { image } = await request.json();
      imageData = image;
    } else {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) return NextResponse.json({ error: "Solo JPG, PNG o WebP" }, { status: 400 });
      if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Máximo 2MB" }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      imageData = `data:${file.type};base64,${base64}`;
    }

    if (!imageData) return NextResponse.json({ error: "Imagen requerida" }, { status: 422 });

    const profile = await db.profile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    await db.profile.update({
      where: { id: profile.id },
      data: { profileImage: imageData },
    });

    return NextResponse.json({ data: { url: imageData } });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}