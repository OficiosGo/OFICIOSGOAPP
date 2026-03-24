import bcrypt from "bcryptjs";
import { userRepository } from "@/server/repositories/user.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
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

    // Check duplicate DNI
    const existingDni = await db.user.findUnique({ where: { dni: input.dni } });
    if (existingDni) {
      throw AppError.conflict("Ya existe una cuenta con ese DNI");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
      phone: input.phone,
      dni: input.dni,
      birthDate: new Date(input.birthDate),
      role: "PROFESSIONAL",
    });

    // Create profile
    const baseSlug = slugify(`${input.name}`);
    const slug = `${baseSlug}-${user.id.slice(-6)}`;

    await professionalRepository.create({
      userId: user.id,
      slug,
      categoryId: input.categoryId,
      city: input.city,
      province: "Córdoba",
    });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
};