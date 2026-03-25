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
    { name: "Refrigeración", slug: "refrigeracion", icon: "❄️", sortOrder: 8 },
    { name: "Jardinería", slug: "jardineria", icon: "🌿", sortOrder: 9 },
    { name: "Limpieza", slug: "limpieza", icon: "🧹", sortOrder: 10 },
    { name: "Cerrajería", slug: "cerrajeria", icon: "🔑", sortOrder: 11 },
    { name: "Niñeras", slug: "nineras", icon: "👶", sortOrder: 12 },
    { name: "Transporte", slug: "transporte", icon: "🚛", sortOrder: 13 },
    { name: "Comisionistas", slug: "comisionistas", icon: "📦", sortOrder: 14 },
    { name: "Fleteros", slug: "fleteros", icon: "🚚", sortOrder: 15 },
    { name: "Transporte Escolar", slug: "transporte-escolar", icon: "🚌", sortOrder: 16 },
    { name: "Cadetes", slug: "cadetes", icon: "🏍️", sortOrder: 17 },
    { name: "Transporte Privado", slug: "transporte-privado", icon: "🚗", sortOrder: 18 },
    { name: "Vehículos", slug: "vehiculos", icon: "🔩", sortOrder: 19 },
    { name: "Reparación de Electrodomésticos", slug: "reparacion-electrodomesticos", icon: "🔌", sortOrder: 20 },
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
  console.log("  20 categorías creadas");
  console.log("  Listo para producción");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });