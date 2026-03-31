import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { db } from "@/db/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Contraseña nueva debe tener mínimo 6 caracteres" }, { status: 422 });
    }

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: user.id }, data: { passwordHash: hash } });

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Error al cambiar contraseña" }, { status: 500 });
  }
}