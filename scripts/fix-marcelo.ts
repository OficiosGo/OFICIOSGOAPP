import { db } from "@/db/client";

async function main() {
  let cat = await db.serviceCategory.findFirst({
    where: {
      OR: [
        { slug: { contains: "gas", mode: "insensitive" } },
        { name: { contains: "gas", mode: "insensitive" } },
      ],
      isActive: true,
    },
  });

  if (!cat) {
    console.log("No encontré categoría de gas. Categorías disponibles:");
    const all = await db.serviceCategory.findMany({ select: { id: true, name: true, slug: true } });
    console.table(all);
    throw new Error("Editá el script con el slug correcto");
  }

  console.log("Categoría:", cat.name, `(${cat.slug})`);

  const profile = await db.profile.create({
    data: {
      userId: "cmnt1v7730000j6ust5excon2",
      slug: "marcelo-brizuela-mb-instalaciones",
      categoryId: cat.id,
      city: "Villa María",
      province: "Córdoba",
      headline: "Gasista matriculado · MB Instalaciones",
      bio: "Marcelo Brizuela, gasista matriculado, especialista en instalación, mantenimiento y reparación de artefactos y cañerías de gas, brindando un servicio seguro, eficiente y conforme a las normativas vigentes, con compromiso, responsabilidad y atención personalizada para cada cliente.",
      whatsapp: "3534268596",
      yearsExperience: 20,
      matricula: "8939",
      availability: "Lunes a viernes de 8 a 20 hs · Sábados de 8 a 12 hs",
      urgencias24hs: false,
      conGarantia: true,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: "admin-manual",
    },
  });

  console.log("OK - Profile creado y aprobado:", profile.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
