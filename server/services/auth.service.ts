import bcrypt from "bcryptjs";
import { userRepository } from "@/server/repositories/user.repository";
import { signToken } from "@/server/auth/jwt";
import { AppError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import { db } from "@/db/client";
import type { LoginInput, RegisterInput } from "@/lib/validators";

export const authService = {
  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user || !user.isActive) {
      throw AppError.unauthorized("Email o contraseña incorrectos");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw AppError.unauthorized("Email o contraseña incorrectos");
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
      },
    };
  },

  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict("Ya existe una cuenta con ese email");
    }

    const existingDni = await db.user.findUnique({ where: { dni: input.dni } });
    if (existingDni) {
      throw AppError.conflict("Ya existe una cuenta con ese DNI");
    }

    const category = await db.serviceCategory.findUnique({
      where: { id: input.categoryId },
      select: { id: true },
    });
    if (!category) {
      throw AppError.conflict("La categoría seleccionada no existe");
    }

    let additionalCategories: string[] = [];
    if (input.additionalCategoryIds && input.additionalCategoryIds.length > 0) {
      const cats = await db.serviceCategory.findMany({
        where: { id: { in: input.additionalCategoryIds } },
        select: { slug: true },
      });
      additionalCategories = cats.map((c) => c.slug);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const baseSlug = slugify(input.name);

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          name: input.name,
          phone: input.phone,
          dni: input.dni,
          birthDate: new Date(input.birthDate),
          role: "PROFESSIONAL",
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          slug: `${baseSlug}-${newUser.id.slice(-6)}`,
          categoryId: input.categoryId,
          city: input.city,
          province: "Córdoba",
          whatsapp: input.phone,
          urgencias24hs: input.urgencias24hs ?? false,
          conGarantia: input.conGarantia ?? false,
          additionalCategoryIds: additionalCategories,
          status: "PENDING",
        },
      });

      return newUser;
    });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  },
};