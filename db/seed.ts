import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding OficiosGo! database...\n");

  // ─── Categories ───────────────────────────────────
  const categoriesData = [
    { name: "Electricista", slug: "electricista", icon: "⚡", sortOrder: 1 },
    { name: "Plomero", slug: "plomero", icon: "🔧", sortOrder: 2 },
    { name: "Gasista", slug: "gasista", icon: "🔥", sortOrder: 3 },
    { name: "Pintor", slug: "pintor", icon: "🎨", sortOrder: 4 },
    { name: "Carpintero", slug: "carpintero", icon: "🪚", sortOrder: 5 },
    { name: "Herrero", slug: "herrero", icon: "🔨", sortOrder: 6 },
    { name: "Albañil", slug: "albanil", icon: "🧱", sortOrder: 7 },
    { name: "Refrigeracion", slug: "refrigeracion", icon: "❄️", sortOrder: 8 },
    { name: "Cerrajero", slug: "cerrajero", icon: "🔑", sortOrder: 9 },
    { name: "Jardinero", slug: "jardinero", icon: "🌿", sortOrder: 10 },
    { name: "Limpieza", slug: "limpieza", icon: "🧹", sortOrder: 11 },
    { name: "Transporte", slug: "transporte", icon: "🚛", sortOrder: 12 },
    { name: "Fletero", slug: "fletero", icon: "🚚", sortOrder: 13 },
    { name: "Electrodomesticos", slug: "electrodomesticos", icon: "🔌", sortOrder: 14 },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
    console.log(`  ${cat.icon} ${cat.name}`);
  }

  // Delete old categories not in list
  const validSlugs = categoriesData.map((c) => c.slug);
  await prisma.serviceCategory.deleteMany({ where: { slug: { notIn: validSlugs } } });

  // ─── Admin ────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@oficiosgo.com" },
    update: {},
    create: { email: "admin@oficiosgo.com", passwordHash: adminHash, name: "Admin OficiosGo", role: "ADMIN" },
  });

  // ─── Clients ──────────────────────────────────────
  const clientHash = await bcrypt.hash("cliente123", 12);
  const clientsData = [
    { email: "martin.gomez@test.com", name: "Martin Gomez" },
    { email: "lucia.fernandez@test.com", name: "Lucia Fernandez" },
    { email: "roberto.silva@test.com", name: "Roberto Silva" },
    { email: "ana.torres@test.com", name: "Ana Torres" },
    { email: "diego.morales@test.com", name: "Diego Morales" },
  ];

  const clientIds: string[] = [];
  for (const c of clientsData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, passwordHash: clientHash, name: c.name, role: "CLIENT" },
    });
    clientIds.push(user.id);
  }

  // ─── Professional ─────────────────────────────────
  const proHash = await bcrypt.hash("pro123", 12);

  const pro = {
    email: "carlos.mendez@test.com",
    name: "Carlos Mendez",
    phone: "5493535698990",
    slug: "carlos-mendez-electricista",
    headline: "Electricista matriculado - instalaciones y reparaciones",
    bio: "Mas de 12 anos trabajando en instalaciones electricas domiciliarias e industriales en Villa Maria y zona. Matriculado ante el Colegio de Tecnicos. Trabajo con garantia escrita.",
    categorySlug: "electricista",
    city: "Villa Maria",
    neighborhood: "Centro",
    whatsapp: "5493535698990",
    yearsExperience: 12,
    matricula: "COET-4821",
    availability: "Lunes a sabado 7:00-18:00",
    urgencias24hs: true,
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    tier: "PREMIUM" as const,
    lat: -32.4050,
    lng: -63.2400,
    reviews: [
      { rating: 5, comment: "Excelente trabajo, llego puntual y dejo todo impecable. Cambio el tablero completo en menos de 3 horas.", clientIndex: 0 },
      { rating: 5, comment: "Muy profesional. Me explico todo lo que hacia y el precio fue justo. Lo recomiendo.", clientIndex: 1 },
      { rating: 4, comment: "Buen trabajo, rapido y prolijo. El resultado estuvo perfecto.", clientIndex: 2 },
      { rating: 5, comment: "Tercer vez que lo contrato y siempre conforme. Sabe mucho y da confianza.", clientIndex: 3 },
      { rating: 5, comment: "Me resolvio un problema electrico que otros no pudieron. Muy recomendable.", clientIndex: 4 },
    ],
  };

  const user = await prisma.user.upsert({
    where: { email: pro.email },
    update: { name: pro.name, phone: pro.phone },
    create: { email: pro.email, passwordHash: proHash, name: pro.name, phone: pro.phone, role: "PROFESSIONAL" },
  });

  const profile = await prisma.profile.upsert({
    where: { slug: pro.slug },
    update: {
      headline: pro.headline,
      bio: pro.bio,
      city: pro.city,
      neighborhood: pro.neighborhood,
      whatsapp: pro.whatsapp,
      yearsExperience: pro.yearsExperience,
      matricula: pro.matricula,
      availability: pro.availability,
      urgencias24hs: pro.urgencias24hs,
      profileImage: pro.profileImage,
      tier: pro.tier,
      latitude: pro.lat,
      longitude: pro.lng,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    create: {
      userId: user.id,
      slug: pro.slug,
      headline: pro.headline,
      bio: pro.bio,
      categoryId: categoryMap[pro.categorySlug],
      city: pro.city,
      province: "Cordoba",
      neighborhood: pro.neighborhood,
      whatsapp: pro.whatsapp,
      yearsExperience: pro.yearsExperience,
      matricula: pro.matricula,
      availability: pro.availability,
      urgencias24hs: pro.urgencias24hs,
      profileImage: pro.profileImage,
      tier: pro.tier,
      latitude: pro.lat,
      longitude: pro.lng,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
  });

  // Reviews
  let totalRating = 0;
  let reviewCount = 0;
  for (const rev of pro.reviews) {
    const authorId = clientIds[rev.clientIndex];
    if (!authorId) continue;
    try {
      await prisma.review.upsert({
        where: { profileId_authorId: { profileId: profile.id, authorId } },
        update: { rating: rev.rating, comment: rev.comment },
        create: { profileId: profile.id, authorId, rating: rev.rating, comment: rev.comment, isVerified: true, isVisible: true },
      });
      totalRating += rev.rating;
      reviewCount++;
    } catch { /* skip */ }
  }

  if (reviewCount > 0) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { averageRating: Math.round((totalRating / reviewCount) * 10) / 10, totalReviews: reviewCount, totalViews: 1230, totalContacts: 89 },
    });
  }

  console.log(`\n  ⚡ ${pro.name} (PREMIUM) - ${reviewCount} resenas`);

  // ─── Generic test client ──────────────────────────
  await prisma.user.upsert({
    where: { email: "cliente@test.com" },
    update: {},
    create: { email: "cliente@test.com", passwordHash: clientHash, name: "Cliente Test", role: "CLIENT" },
  });

  console.log("\nSeed completado!\n");
  console.log("  Admin        admin@oficiosgo.com  / admin123");
  console.log("  Cliente      cliente@test.com     / cliente123");
  console.log("  Profesional  carlos.mendez@test.com / pro123");
  console.log(`  ${categoriesData.length} categorias`);
  console.log(`  1 profesional demo con ${reviewCount} resenas\n`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });