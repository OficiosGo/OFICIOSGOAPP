"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { db } from "@/db/client";
import type { Result } from "@/types";

export async function createSponsor(formData: FormData): Promise<Result<void>> {
  try {
    await requireAdmin();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const description = formData.get("description") as string;
    const tier = formData.get("tier") as string;
    const logoUrl = formData.get("logoUrl") as string;

    if (!name || !description) {
      return { success: false, error: "Nombre y descripción son requeridos", code: "VALIDATION" };
    }

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    await db.sponsor.create({
      data: {
        name,
        slug,
        phone: phone || null,
        whatsapp: whatsapp || null,
        description,
        logoUrl: logoUrl || null,
        tier: tier === "PREMIUM" ? "PREMIUM" : "STANDARD",
        city: "Villa María",
        province: "Córdoba",
        isActive: true,
      },
    });

    revalidatePath("/admin/profesionales");
    revalidatePath("/app");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("createSponsor error:", error);
    return { success: false, error: "Error al crear sponsor", code: "INTERNAL" };
  }
}

export async function deleteSponsor(sponsorId: string): Promise<Result<void>> {
  try {
    await requireAdmin();
    await db.sponsor.delete({ where: { id: sponsorId } });
    revalidatePath("/admin/profesionales");
    revalidatePath("/app");
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("deleteSponsor error:", error);
    return { success: false, error: "Error al eliminar sponsor", code: "INTERNAL" };
  }
}

export async function changeTier(profileId: string, tier: string): Promise<Result<void>> {
  try {
    await requireAdmin();

    if (!["FREE", "STANDARD", "PREMIUM"].includes(tier)) {
      return { success: false, error: "Tier inválido", code: "VALIDATION" };
    }

    await db.profile.update({
      where: { id: profileId },
      data: { tier: tier as any },
    });

    revalidatePath("/admin/profesionales");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("changeTier error:", error);
    return { success: false, error: "Error al cambiar el plan", code: "INTERNAL" };
  }
}