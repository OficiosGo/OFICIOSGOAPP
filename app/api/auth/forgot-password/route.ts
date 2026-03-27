import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { sendResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 422 });
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ data: { ok: true } });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const exp = new Date(Date.now() + 60 * 60 * 1000);

    await db.$executeRaw`UPDATE "User" SET "resetToken" = ${token}, "resetTokenExp" = ${exp} WHERE "id" = ${user.id}`;

    await sendResetEmail(email, token);

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
  }
}