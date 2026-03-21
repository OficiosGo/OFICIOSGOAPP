import { getAuthCookie } from "./cookies";
import { verifyToken } from "./jwt";
import type { AuthUser } from "@/types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role as AuthUser["role"],
  };
}
