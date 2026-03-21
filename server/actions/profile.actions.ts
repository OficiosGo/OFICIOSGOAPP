"use server";

import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@/lib/validators";
import { requireProfessional, requireAdmin } from "@/server/auth/guards";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { db } from "@/db/client";
import type { Result } from "@/types";

export async function updateProfile(formData: FormData): Promise<Result<{ slug: string }>> {
  try {
    const user = await requireProfessional();
    const raw = Object.fromEntries(formData.entries());
    const parsed = updateProfileSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos",
        code: "VALIDATION",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const profile = await professionalRepository.getByUserId(user.id);
    if (!profile) {
      return { success: false, error: "Perfil no encontrado", code: "NOT_FOUND" };
    }

    const updated = await professionalRepository.update(profile.id, parsed.data);
    revalidatePath(`/profesional/${updated.slug}`);
    revalidatePath("/dashboard");

    return { success: true, data: { slug: updated.slug } };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, error: "Error al actualizar el perfil", code: "INTERNAL" };
  }
}

export async function approveProfessional(profileId: string): Promise<Result<void>> {
  try {
    const admin = await requireAdmin();

    const profile = await professionalRepository.getById(profileId);
    if (!profile) {
      return { success: false, error: "Perfil no encontrado", code: "NOT_FOUND" };
    }
    if (profile.status !== "PENDING") {
      return { success: false, error: "El perfil no está pendiente", code: "CONFLICT" };
    }

    await db.profile.update({
      where: { id: profileId },
      data: { status: "APPROVED", approvedAt: new Date(), approvedBy: admin.id },
    });

    revalidatePath("/admin/profesionales");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("approveProfessional error:", error);
    return { success: false, error: "Error al aprobar", code: "INTERNAL" };
  }
}

export async function suspendProfessional(profileId: string): Promise<Result<void>> {
  try {
    await requireAdmin();

    await db.profile.update({
      where: { id: profileId },
      data: { status: "SUSPENDED" },
    });

    revalidatePath("/admin/profesionales");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("suspendProfessional error:", error);
    return { success: false, error: "Error al suspender", code: "INTERNAL" };
  }
}

export async function trackContact(profileId: string): Promise<void> {
  try {
    await professionalRepository.incrementContacts(profileId);
  } catch {
    // Non-critical, don't throw
  }
}
