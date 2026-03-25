import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OficiosGo! database...\n");

  // ─── Categories ───────────────────────────────────
  const categoriesData = [
    { name: "Carpintero", slug: "carpintero", icon: "🪚", sortOrder: 1 },
    { name: "Electricista", slug: "electricista", icon: "⚡", sortOrder: 2 },
    { name: "Gasista", slug: "gasista", icon: "🔥", sortOrder: 3 },
    { name: "Plomero", slug: "plomero", icon: "🔧", sortOrder: 4 },
    { name: "Construcción", slug: "construccion", icon: "🧱", sortOrder: 5 },
    { name: "Pintor", slug: "pintor", icon: "🎨", sortOrder: 6 },
    { name: "Herrero", slug: "herrero", icon: "⚒️", sortOrder: 7 },
    { name: "Aire Acondicionado", slug: "aire-acondicionado", icon: "❄️", sortOrder: 8 },
    { name: "Jardinería", slug: "jardineria", icon: "🌿", sortOrder: 9 },
    { name: "Limpieza", slug: "limpieza", icon: "🧹", sortOrder: 10 },
    { name: "Cerrajería", slug: "cerrajeria", icon: "🔑", sortOrder: 11 },
    { name: "Niñeras", slug: "nineras", icon: "👶", sortOrder: 12 },
    { name: "Fletes", slug: "fletes", icon: "🚚", sortOrder: 13 },
    { name: "Vehículos", slug: "vehiculos", icon: "🚗", sortOrder: 14 },
    { name: "Electrodomésticos", slug: "electrodomesticos", icon: "🔌", sortOrder: 15 },
  ];

  for (const cat of categoriesData) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
    console.log(`  ✅ Categoría: ${cat.icon} ${cat.name}`);
  }

  // ─── Delete old categories that are no longer needed ───
  const validSlugs = categoriesData.map(c => c.slug);
  const deleted = await prisma.serviceCategory.deleteMany({
    where: { slug: { notIn: validSlugs } },
  });
  if (deleted.count > 0) {
    console.log(`  🗑️  Eliminadas ${deleted.count} categorías antiguas`);
  }

  // ─── Admin user ───────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@oficiosgo.com" },
    update: {},
    create: {
      email: "admin@oficiosgo.com",
      passwordHash: adminHash,
      name: "Admin OficiosGo",
      role: "ADMIN",
    },
  });
  console.log(`\n  👑 Admin: admin@oficiosgo.com / admin123`);

  console.log("\n✅ Seed completado!\n");
  console.log("═══════════════════════════════════════════");
  console.log("  Credenciales:");
  console.log("  Admin: admin@oficiosgo.com / admin123");
  console.log("═══════════════════════════════════════════");
  console.log("  15 categorías creadas");
  console.log("  Sin profesionales demo — listo para producción");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });