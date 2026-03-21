import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OficiosGo! database...\n");

  // ─── Categories ───────────────────────────────────
  const categoriesData = [
    { name: "Electricista", slug: "electricista", icon: "⚡", sortOrder: 1 },
    { name: "Plomero", slug: "plomero", icon: "🔧", sortOrder: 2 },
    { name: "Carpintero", slug: "carpintero", icon: "🪚", sortOrder: 3 },
    { name: "Pintor", slug: "pintor", icon: "🎨", sortOrder: 4 },
    { name: "Gasista", slug: "gasista", icon: "🔥", sortOrder: 5 },
    { name: "Albañil", slug: "albañil", icon: "🧱", sortOrder: 6 },
    { name: "Cerrajero", slug: "cerrajero", icon: "🔑", sortOrder: 7 },
    { name: "Techista", slug: "techista", icon: "🏠", sortOrder: 8 },
    { name: "Jardinero", slug: "jardinero", icon: "🌿", sortOrder: 9 },
    { name: "Aire Acondicionado", slug: "aire-acondicionado", icon: "❄️", sortOrder: 10 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created.id;
    console.log(`  ✅ Categoría: ${cat.icon} ${cat.name}`);
  }

  // ─── Admin user ───────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
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

  // ─── Client user (for reviews) ────────────────────
  const clientHash = await bcrypt.hash("cliente123", 12);
  const client = await prisma.user.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: {
      email: "cliente@test.com",
      passwordHash: clientHash,
      name: "María García",
      phone: "3534999888",
      role: "CLIENT",
    },
  });
  console.log(`  👤 Cliente: cliente@test.com / cliente123`);

  // ─── Professionals ────────────────────────────────
  const professionalsData = [
    {
      email: "carlos@test.com",
      name: "Carlos Méndez",
      phone: "3534112233",
      slug: "carlos-mendez-electricista",
      categorySlug: "electricista",
      headline: "Electricista matriculado — 18 años de experiencia",
      bio: "Instalaciones eléctricas domiciliarias e industriales. Tableros, tendido de líneas, iluminación LED, puesta a tierra. Trabajo prolijo y garantizado. Matrícula provincial N° 4521.",
      whatsapp: "3534112233",
      yearsExperience: 18,
      tier: "PREMIUM" as const,
      matricula: "MP-4521",
      availability: "Lunes a viernes 8:00 - 18:00 · Sábados 8:00 - 13:00",
      rating: 4.9,
      reviews: 47,
      views: 1230,
      contacts: 89,
      lat: -32.4050, lng: -63.2400,
    },
    {
      email: "miguel@test.com",
      name: "Miguel Ángel Torres",
      phone: "3534445566",
      slug: "miguel-torres-plomero",
      categorySlug: "plomero",
      headline: "Plomería integral — Urgencias 24hs",
      bio: "Destapaciones, instalación de termotanques, reparación de pérdidas, tendido de cañerías. Atención rápida en urgencias. Presupuesto sin cargo.",
      whatsapp: "3534445566",
      yearsExperience: 12,
      tier: "PREMIUM" as const,
      matricula: null,
      availability: "Lunes a sábados 7:00 - 20:00 · Urgencias 24hs",
      rating: 4.7,
      reviews: 33,
      views: 890,
      contacts: 67,
      lat: -32.4120, lng: -63.2510,
    },
    {
      email: "fernando@test.com",
      name: "Fernando Ruiz",
      phone: "3534778899",
      slug: "fernando-ruiz-pintor",
      categorySlug: "pintor",
      headline: "Pintura interior y exterior — Acabado profesional",
      bio: "Pintura de interiores, exteriores, revestimientos texturados, impermeabilización. Trabajo limpio y prolijo. 10 años en el rubro.",
      whatsapp: "3534778899",
      yearsExperience: 10,
      tier: "STANDARD" as const,
      matricula: null,
      availability: "Lunes a viernes 8:00 - 17:00",
      rating: 4.8,
      reviews: 28,
      views: 670,
      contacts: 45,
      lat: -32.3990, lng: -63.2350,
    },
    {
      email: "raul@test.com",
      name: "Raúl Domínguez",
      phone: "3534001122",
      slug: "raul-dominguez-albanil",
      categorySlug: "albañil",
      headline: "Albañilería general — Construcción y reformas",
      bio: "Construcción de viviendas, reformas, ampliaciones, pisos, revoques. Experiencia en obra gruesa y fina. Trabajo garantizado.",
      whatsapp: "3534001122",
      yearsExperience: 22,
      tier: "FREE" as const,
      matricula: null,
      availability: "Lunes a viernes 7:00 - 17:00",
      rating: 4.6,
      reviews: 19,
      views: 450,
      contacts: 34,
      lat: -32.4180, lng: -63.2300,
    },
    {
      email: "luciano@test.com",
      name: "Luciano Pereyra",
      phone: "3534334455",
      slug: "luciano-pereyra-gasista",
      categorySlug: "gasista",
      headline: "Gasista matriculado — Instalaciones y reparaciones",
      bio: "Instalaciones de gas natural, reparación de pérdidas, colocación de artefactos, certificaciones. Matrícula ENARGAS vigente.",
      whatsapp: "3534334455",
      yearsExperience: 14,
      tier: "PREMIUM" as const,
      matricula: "ENARGAS-8832",
      availability: "Lunes a viernes 8:00 - 18:00",
      rating: 4.9,
      reviews: 22,
      views: 380,
      contacts: 41,
      lat: -32.4000, lng: -63.2550,
    },
    {
      email: "diego@test.com",
      name: "Diego Acosta",
      phone: "3534667788",
      slug: "diego-acosta-carpintero",
      categorySlug: "carpintero",
      headline: "Carpintería a medida — Muebles y aberturas",
      bio: "Muebles a medida, placards, cocinas, puertas y ventanas. Trabajo artesanal con materiales de primera calidad.",
      whatsapp: "3534667788",
      yearsExperience: 16,
      tier: "STANDARD" as const,
      matricula: null,
      availability: "Lunes a viernes 8:00 - 17:00 · Sábados con turno previo",
      rating: 4.8,
      reviews: 31,
      views: 720,
      contacts: 58,
      lat: -32.4100, lng: -63.2450,
    },
    {
      email: "gustavo@test.com",
      name: "Gustavo Herrera",
      phone: "3534990011",
      slug: "gustavo-herrera-aire",
      categorySlug: "aire-acondicionado",
      headline: "Instalación y service de aire acondicionado",
      bio: "Instalación, carga de gas, limpieza y mantenimiento de splits y centrales. Todas las marcas. Garantía escrita.",
      whatsapp: "3534990011",
      yearsExperience: 8,
      tier: "FREE" as const,
      matricula: null,
      availability: "Lunes a sábados 8:00 - 19:00",
      rating: 4.5,
      reviews: 15,
      views: 340,
      contacts: 28,
      lat: -32.3950, lng: -63.2480,
    },
    {
      email: "hector@test.com",
      name: "Héctor Molina",
      phone: "3534223344",
      slug: "hector-molina-cerrajero",
      categorySlug: "cerrajero",
      headline: "Cerrajería 24hs — Apertura, cambio y reparación",
      bio: "Apertura de puertas, cambio de cerraduras, copias de llaves, cerraduras de seguridad. Atención inmediata las 24 horas.",
      whatsapp: "3534223344",
      yearsExperience: 20,
      tier: "STANDARD" as const,
      matricula: null,
      availability: "24 horas · 7 días",
      rating: 4.7,
      reviews: 42,
      views: 890,
      contacts: 95,
      lat: -32.4070, lng: -63.2380,
    },
  ];

  const passHash = await bcrypt.hash("pro123", 12);

  for (const pro of professionalsData) {
    const user = await prisma.user.upsert({
      where: { email: pro.email },
      update: {},
      create: {
        email: pro.email,
        passwordHash: passHash,
        name: pro.name,
        phone: pro.phone,
        role: "PROFESSIONAL",
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        headline: pro.headline,
        bio: pro.bio,
        tier: pro.tier,
        latitude: pro.lat,
        longitude: pro.lng,
        averageRating: pro.rating,
        totalReviews: pro.reviews,
        totalViews: pro.views,
        totalContacts: pro.contacts,
      },
      create: {
        userId: user.id,
        slug: pro.slug,
        categoryId: categories[pro.categorySlug],
        city: "Villa María",
        province: "Córdoba",
        latitude: pro.lat,
        longitude: pro.lng,
        headline: pro.headline,
        bio: pro.bio,
        whatsapp: pro.whatsapp,
        yearsExperience: pro.yearsExperience,
        tier: pro.tier,
        matricula: pro.matricula,
        availability: pro.availability,
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: admin.id,
        averageRating: pro.rating,
        totalReviews: pro.reviews,
        totalViews: pro.views,
        totalContacts: pro.contacts,
      },
    });

    console.log(`  🔨 Profesional: ${pro.name} (${pro.tier}) — ${pro.email} / pro123`);
  }

  // ─── Reviews ──────────────────────────────────────
  const profiles = await prisma.profile.findMany({ take: 3 });
  for (const profile of profiles) {
    const existing = await prisma.review.findUnique({
      where: { profileId_authorId: { profileId: profile.id, authorId: client.id } },
    });
    if (!existing) {
      await prisma.review.create({
        data: {
          profileId: profile.id,
          authorId: client.id,
          rating: 5,
          comment: "Excelente trabajo, muy profesional y puntual. Lo recomiendo totalmente.",
          isVerified: true,
          isVisible: true,
        },
      });
    }
  }
  console.log(`\n  ⭐ Reseñas creadas para ${profiles.length} profesionales`);

  // ─── Sponsors ─────────────────────────────────────
  const sponsorsData = [
    {
      name: "Ferretería El Constructor",
      slug: "ferreteria-el-constructor",
      tier: "PREMIUM" as const,
      phone: "3534111000",
      description: "Todo para tu obra · Materiales, herramientas, sanitarios",
      city: "Villa María",
    },
    {
      name: "Casa del Electricista",
      slug: "casa-del-electricista",
      tier: "PREMIUM" as const,
      phone: "3534222000",
      description: "Materiales eléctricos · Iluminación LED · Tableros",
      city: "Villa María",
    },
    {
      name: "Pinturas del Centro",
      slug: "pinturas-del-centro",
      tier: "STANDARD" as const,
      phone: "3534333000",
      description: "Pinturas · Revestimientos · Color a medida",
      city: "Villa María",
    },
  ];

  for (const sponsor of sponsorsData) {
    await prisma.sponsor.upsert({
      where: { slug: sponsor.slug },
      update: sponsor,
      create: sponsor,
    });
    console.log(`  🏪 Sponsor: ${sponsor.name} (${sponsor.tier})`);
  }

  console.log("\n✅ Seed completado!\n");
  console.log("═══════════════════════════════════════════");
  console.log("  Credenciales:");
  console.log("  Admin:    admin@oficiosgo.com / admin123");
  console.log("  Cliente:  cliente@test.com / cliente123");
  console.log("  Profesional: carlos@test.com / pro123");
  console.log("  (todos los profesionales usan pro123)");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
