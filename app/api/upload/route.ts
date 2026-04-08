import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Solo JPG, PNG o WebP" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Máximo 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${user.id}-${Date.now()}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Update profile if it's a profile photo upload
    const profile = await db.profile.findUnique({ where: { userId: user.id } });
    if (profile) {
      await db.profile.update({
        where: { id: profile.id },
        data: { profileImage: blob.url },
      });
    }

    return NextResponse.json({ data: { url: blob.url } });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}