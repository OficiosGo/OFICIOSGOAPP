import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
    }

    const users = await db.$queryRaw<Array<{ id: string }>>`
      SELECT "id" FROM "User" WHERE "resetToken" = ${token} AND "resetTokenExp" >= NOW() LIMIT 1
    `;

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "El link expiró o es inválido. Pedí uno nuevo." }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);

    await db.$executeRaw`UPDATE "User" SET "passwordHash" = ${hash}, "resetToken" = NULL, "resetTokenExp" = NULL WHERE "id" = ${users[0].id}`;

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Error al cambiar la contraseña" }, { status: 500 });
  }
}