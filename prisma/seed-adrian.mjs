import { PrismaClient, ProfileStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ⚠️ CAMBIÁ ESTOS DOS VALORES ANTES DE CORRER
const EMAIL = 'adrian.benitez@ejemplo.com';
const WHATSAPP = '3534000000'; // sin +54, formato que uses en OficiosGo
const PASSWORD_TEMPORAL = 'Adrian2026!'; // avisale para que la cambie

async function main() {
  // 1. Limpiar rastros previos (por si quedó algo huérfano)
  console.log('🧹 Limpiando registros previos...');
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: EMAIL },
        { dni: '32307557' },
      ],
    },
  });

  // 2. Buscar la categoría "Portones Automáticos"
  console.log('🔍 Buscando categoría Portones Automáticos...');
  let categoria = await prisma.serviceCategory.findFirst({
    where: {
      OR: [
        { name: { contains: 'Portones', mode: 'insensitive' } },
        { slug: { contains: 'portones', mode: 'insensitive' } },
      ],
    },
  });

  if (!categoria) {
    console.log('⚠️  No existe la categoría, la creo...');
    categoria = await prisma.serviceCategory.create({
      data: {
        name: 'Portones Automáticos',
        slug: 'portones-automaticos',
        icon: '🚪',
        description: 'Instalación, reparación y automatización de portones y cortinas metálicas',
        isActive: true,
      },
    });
  }
  console.log('✅ Categoría:', categoria.name, '(id:', categoria.id + ')');

  // 3. Hashear contraseña
  const passwordHash = await bcrypt.hash(PASSWORD_TEMPORAL, 10);

  // 4. Crear User + Profile en una sola transacción
  console.log('👤 Creando usuario y perfil...');
  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      passwordHash,
      name: 'Adrián Miguel Benítez',
      phone: WHATSAPP,
      dni: '32307557',
      birthDate: new Date('1986-08-29'),
      role: UserRole.PROFESSIONAL,
      isActive: true,
      profile: {
        create: {
          slug: 'adrian-benitez-portones',
          headline: 'Reparación y automatización de portones y cortinas metálicas',
          bio: 'Reparación y automatización de portones y cortinas metálicas. Automatización de cortinas de casas. 15 años de experiencia.',
          categoryId: categoria.id,
          city: 'Villa María',
          province: 'Córdoba',
          whatsapp: WHATSAPP,
          yearsExperience: 15,
          availability: 'De 8:00 a 20:30',
          urgencias24hs: false,
          conGarantia: true,
          status: ProfileStatus.APPROVED, // ya aprobado para que aparezca directo
          approvedAt: new Date(),
        },
      },
    },
    include: { profile: true },
  });

  console.log('\n✅ LISTO');
  console.log('User ID:', user.id);
  console.log('Profile ID:', user.profile?.id);
  console.log('Email:', user.email);
  console.log('Password temporal:', PASSWORD_TEMPORAL);
  console.log('Slug del perfil:', user.profile?.slug);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());