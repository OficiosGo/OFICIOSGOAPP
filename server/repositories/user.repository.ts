import { db } from "@/db/client";

export const userRepository = {
  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
      include: { profile: { include: { category: true } } },
    });
  },

  async findById(id: string) {
    return db.user.findUnique({
      where: { id, isActive: true },
      include: { profile: { include: { category: true } } },
    });
  },

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
    dni?: string;
    birthDate?: Date;
    role?: "PROFESSIONAL" | "CLIENT" | "ADMIN";
  }) {
    return db.user.create({ data });
  },

  async count() {
    return db.user.count({ where: { isActive: true } });
  },
};