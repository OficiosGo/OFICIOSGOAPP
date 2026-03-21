import { getCurrentUser } from "./session";
import { AppError } from "@/lib/errors";
import type { AuthUser } from "@/types";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw AppError.unauthorized("Sesión expirada. Iniciá sesión nuevamente.");
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw AppError.forbidden("Se requiere rol de administrador");
  return user;
}

export async function requireProfessional(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "PROFESSIONAL" && user.role !== "ADMIN") {
    throw AppError.forbidden("Se requiere rol de profesional");
  }
  return user;
}
