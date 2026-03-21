# OficiosGo! 🔨

**Marketplace de oficios para Villa María, Córdoba.**  
Conecta profesionales verificados (electricistas, plomeros, carpinteros, pintores y más) con clientes que los necesitan.

## Stack

- **Next.js 15** + App Router + React 19
- **TypeScript** strict mode
- **PostgreSQL** (Neon) + **Prisma** ORM
- **Tailwind CSS** con colores de marca
- **JWT** + HttpOnly cookies (auth propia)
- **Vercel** deploy

## Setup rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon y JWT_SECRET

# 3. Crear tablas en la base de datos
npx prisma db push

# 4. Seed: categorías, profesionales de prueba, admin, sponsors
npm run db:seed

# 5. Iniciar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Credenciales de prueba (post-seed)

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@oficiosgo.com | admin123 |
| Cliente | cliente@test.com | cliente123 |
| Profesional | carlos@test.com | pro123 |

Todos los profesionales usan password `pro123`.

## Estructura del proyecto

```
app/                    → Rutas (App Router)
  (marketing)/          → Páginas públicas (home, buscar, perfil)
  (auth)/               → Login, registro
  dashboard/            → Panel del profesional (protegido)
  admin/                → Panel admin (protegido)
  api/                  → API Routes (9 endpoints)
components/
  ui/                   → Primitivos (navbar, footer)
  features/             → Componentes de negocio (cards, contact)
server/
  auth/                 → JWT, cookies, session, guards
  repositories/         → Acceso a datos (Prisma)
  services/             → Lógica de negocio
  actions/              → Server Actions
lib/                    → Utils, validators (Zod), errors, constants
db/                     → Prisma client singleton, seed
types/                  → TypeScript types globales
prisma/                 → Schema + migrations
middleware.ts           → Auth guard (/dashboard, /admin)
```

## API Endpoints

| Method | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login con email/password |
| POST | /api/auth/register | No | Registro de profesional |
| POST | /api/auth/logout | No | Cerrar sesión |
| GET | /api/auth/me | Sí | Usuario actual |
| GET | /api/professionals | No | Listar profesionales |
| GET | /api/professionals/search | No | Búsqueda con filtros |
| GET | /api/professionals/[id] | No | Detalle por ID o slug |
| GET | /api/categories | No | Listar categorías |
| GET/POST | /api/reviews | GET:No POST:Sí | Reseñas |
| GET | /api/sponsors | No | Sponsors activos |

## Deploy a Vercel

1. Push a GitHub
2. Importar en Vercel
3. Agregar variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
4. Vercel ejecuta `prisma generate && next build` automáticamente
5. Ejecutar seed manualmente o desde Vercel CLI: `npx vercel env pull && npm run db:seed`

## Modelo de datos

- **User** — Auth, roles (PROFESSIONAL/CLIENT/ADMIN)
- **Profile** — Oficio, ubicación, experiencia, tier (FREE/STANDARD/PREMIUM)
- **ServiceCategory** — 10 categorías de oficios
- **WorkPhoto** — Galería de trabajos
- **Review** — Reseñas con rating 1-5 y respuesta del profesional
- **Sponsor** — Proveedores/ferreterías asociadas (PREMIUM/STANDARD)
- **ProfileEvent** — Tracking de vistas y contactos

## Roadmap

- [x] Auth JWT + middleware
- [x] CRUD profesionales + búsqueda con premium boost
- [x] Perfil público con galería y reseñas
- [x] Dashboard con métricas reales
- [x] Panel admin (aprobar/suspender)
- [x] Sponsors con tiers
- [ ] Suscripciones MercadoPago (Fase 2)
- [ ] Upload de fotos (Vercel Blob)
- [ ] Notificaciones email (Resend)
- [ ] App nativa (Expo)
