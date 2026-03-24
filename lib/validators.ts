import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().regex(/^\d{10,13}$/, "Teléfono inválido").optional(),
  categoryId: z.string().cuid("Categoría inválida"),
  city: z.string().min(2, "Ciudad requerida"),
});

export const updateProfileSchema = z.object({
  headline: z.string().min(10, "Mínimo 10 caracteres").max(120).optional(),
  bio: z.string().max(2000).optional(),
  whatsapp: z.string().regex(/^\d{10,13}$/, "WhatsApp inválido").optional(),
  yearsExperience: z.coerce.number().int().min(0).max(60).optional(),
  city: z.string().min(2).optional(),
  province: z.string().min(2).optional(),
  neighborhood: z.string().max(100).optional(),
  availability: z.string().max(200).optional(),
  matricula: z.string().max(50).optional(),
});

export const reviewSchema = z.object({
  profileId: z.string().cuid("Perfil inválido"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const searchSchema = z.object({
  category: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  query: z.string().max(200).optional().nullable(),
  lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  lng: z.coerce.number().min(-180).max(180).optional().nullable(),
  radius: z.coerce.number().min(1).max(200).default(50), // km
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;

export const budgetRequestSchema = z.object({
  categoryId: z.string().cuid("Categoría inválida"),
  clientName: z.string().min(2, "Mínimo 2 caracteres").max(100),
  clientPhone: z.string().min(8, "Teléfono inválido").max(15),
  clientEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  description: z.string().min(10, "Describí con más detalle qué necesitás").max(1000),
});

export type BudgetRequestInput = z.infer<typeof budgetRequestSchema>;