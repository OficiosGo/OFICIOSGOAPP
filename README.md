# OficiosGo! 🔨

**Marketplace de oficios para Villa Maria, Cordoba.**
Conecta profesionales verificados (electricistas, plomeros, carpinteros, pintores y mas) con clientes que los necesitan.

**Live:** [oficios-go.vercel.app](https://oficios-go.vercel.app)

---

## Stack

- **Next.js 15** + App Router + React 19
- **TypeScript** strict mode
- **PostgreSQL** (Neon) + **Prisma 5.22** ORM
- **Tailwind CSS** con sistema de diseno custom
- **JWT** + HttpOnly cookies (auth propia, sin dependencias externas)
- **PWA** (manifest.json + Service Worker + install prompt iOS/Android)
- **Vercel** CI/CD

---

## Setup rapido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon y JWT_SECRET

# 3. Crear tablas en la base de datos
npx prisma db push

# 4. Seed: categorias, profesional demo, admin, clientes, resenas
npm run db:seed

# 5. Iniciar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Credenciales (post-seed)

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@oficiosgo.com | admin123 |
| **Profesional** | sebastian.vera@test.com | pro123 |
| **Cliente** | cliente@test.com | cliente123 |

> **IMPORTANTE:** Cambiar la password del admin antes de lanzar en produccion.

---

## Funcionalidades completas

### Para Clientes
- Buscar profesionales por categoria y zona
- Ver perfil completo con foto, resenas y datos de contacto
- Contactar por WhatsApp o telefono directo (sin intermediarios)
- Dejar resenas (logueado o como invitado con nombre y telefono)
- Pedir presupuesto a todos los profesionales de una categoria
- Instalar como PWA en el celular (Android nativo + iOS guia)

### Para Profesionales
- Registro multi-step (DNI, fecha nacimiento, categoria, urgencias 24hs)
- Dashboard con metricas reales: visitas, contactos, rating, resenas
- Editar perfil: descripcion, WhatsApp, disponibilidad, matricula, barrio
- Subir foto de perfil desde el dashboard
- Ver resenas de clientes con rating visual
- Estadisticas con tasa de conversion (visitas → contactos)
- Badge de urgencias 24hs (rojo, animado)
- Planes: Free / Standard / Premium con badges diferenciados

### Panel de Administracion
- **Aprobacion de profesionales:** lista de pendientes con botones Aprobar/Suspender
- **Moderacion de perfiles:** suspender profesionales activos, reactivar suspendidos
- **Control de usuarios:** metricas de clientes, profesionales por estado, usuarios totales
- **Gestion de perfiles:** ver tier (Premium/Standard/Free), datos completos, link a perfil publico
- **Estadisticas de plataforma:** 9 metricas (profesionales, aprobados, pendientes, suspendidos, clientes, usuarios, resenas, presupuestos, interacciones)
- **Herramientas:** link a Neon, Vercel, ver la app, registrar profesional manualmente

### Sponsors
- Sistema de sponsors con tiers (Premium Partner / Sponsor oficial)
- Carousel infinito animado en la landing page con logos y CTAs
- Cards premium con borde dorado, glow y barra de color
- Boton "Llamar" clickeable en cada sponsor
- CTA de "Queres ser sponsor?" con link a WhatsApp
- Seccion dedicada en la PWA Home con espacio publicitario premium

### Plataforma
- Landing page desktop responsive con phone mockup 3D flotante
- PWA mobile-first (430px max-width, bottom tab bar, install prompt)
- SEO local optimizado (meta tags, H1/H2, keywords Villa Maria, Cordoba)
- Paginas legales: Terminos de uso y Politica de privacidad
- Footer con links funcionales a todas las secciones
- Middleware de auth por rol (ADMIN → /admin, PROFESSIONAL → /dashboard, CLIENT → /app)

---

## Estructura del proyecto

```
app/
  page.tsx                        → Landing page (desktop, carousel sponsors)
  app/
    page.tsx                      → PWA Home (categorias, featured, sponsors)
    buscar/page.tsx               → Busqueda por categorias + profesionales
    profesional/[slug]/page.tsx   → Perfil publico (foto, resenas, review form, contacto)
    dashboard/page.tsx            → Panel del profesional (metricas, presupuestos)
    pedidos/page.tsx              → Pedidos del cliente
    cuenta/
      page.tsx                    → Menu de cuenta con sub-paginas
      editar/page.tsx             → Editar perfil profesional
      fotos/page.tsx              → Fotos de trabajo
      resenas/page.tsx            → Ver resenas recibidas
      estadisticas/page.tsx       → Metricas y tasa de conversion
  (auth)/
    login/page.tsx                → Login
    registro/page.tsx             → Registro multi-step
  admin/
    page.tsx                      → Redirect a /admin/profesionales
    profesionales/page.tsx        → Panel admin completo
  api/
    auth/login/                   → POST login con JWT
    auth/register/                → POST registro profesional
    auth/logout/                  → POST logout con redirect
    auth/me/                      → GET usuario actual
    professionals/                → GET listar profesionales
    professionals/search/         → GET busqueda con filtros
    professionals/[id]/           → GET detalle por ID
    categories/                   → GET categorias
    reviews/                      → GET/POST resenas (autenticado)
    reviews/public/               → POST resenas sin login (invitado)
    budget/                       → POST pedir presupuesto
    sponsors/                     → GET sponsors activos
    upload/                       → POST subir foto de perfil
    profile/update/               → POST actualizar perfil

components/
  ui/                             → Navbar, Footer, Logo, LandingNavbar
  features/                       → ContactButtons, ReviewForm, BudgetRequestForm,
                                    ProfilePhotoUpload, HomeCTAs, ProfessionalCard
  pwa/                            → BottomTabBar, InstallBanner, InstallButton, SwRegister

server/
  auth/                           → JWT, cookies, session, guards (requireAuth, requireAdmin)
  repositories/                   → Acceso a datos via Prisma
  services/                       → Logica de negocio (auth, search)
  actions/                        → Server Actions (updateProfile, approveProfessional, suspendProfessional)

lib/                              → Utils, validators (Zod), errors, constants
db/                               → Prisma client singleton, seed
types/                            → TypeScript types globales
prisma/                           → Schema (9 modelos)
middleware.ts                     → Auth guard por rol con proteccion de rutas
```

---

## Modelo de datos (Prisma)

| Modelo | Descripcion |
|--------|-------------|
| **User** | Auth, roles (PROFESSIONAL/CLIENT/ADMIN), DNI, birthDate |
| **Profile** | Oficio, ubicacion, experiencia, tier, urgencias24hs, profileImage, averageRating |
| **ServiceCategory** | 14 categorias de oficios con iconos emoji |
| **WorkPhoto** | Galeria de trabajos del profesional |
| **Review** | Resenas con rating 1-5, comentario, respuesta del profesional, verificacion |
| **Sponsor** | Negocios asociados (PREMIUM/STANDARD) con logoUrl, phone, whatsapp |
| **ProfileEvent** | Tracking de vistas y contactos por profesional |
| **BudgetRequest** | Solicitudes de presupuesto de clientes por categoria |
| **BudgetResponse** | Respuestas de profesionales a presupuestos |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
JWT_SECRET=tu-secret-seguro-de-32-caracteres-minimo
NEXT_PUBLIC_APP_URL=https://oficios-go.vercel.app
NEXT_PUBLIC_APP_NAME=OficiosGo
```

---

## Deploy a Vercel

1. Push a GitHub
2. Importar en Vercel
3. Agregar variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
4. Vercel ejecuta `prisma generate && next build` automaticamente
5. Ejecutar seed: `npx vercel env pull && npm run db:seed`

**Dominio custom (oficiosgo.com):**
- DNS A record: `76.76.21.21`
- DNS CNAME: `cname.vercel-dns.com`

---

## Checklist de produccion

### Paginas y navegacion
- [x] Landing page desktop con hero, phone mockup, carousel sponsors
- [x] PWA Home mobile con categorias, featured, sponsors, publicidad
- [x] Busqueda por categoria con listado filtrado
- [x] Perfil publico con foto, resenas, contacto WhatsApp, review form
- [x] Paginas legales (Terminos + Privacidad)
- [x] Footer con todos los links funcionales

### Autenticacion y roles
- [x] Login/Registro con JWT HttpOnly cookies
- [x] Registro multi-step (DNI, fecha nacimiento, categoria, urgencias)
- [x] Middleware por rol (ADMIN/PROFESSIONAL/CLIENT)
- [x] Admin accede a /registro sin rebotar
- [x] Logout con redirect a /app

### Profesional
- [x] Dashboard con metricas reales (visitas, contactos, rating, resenas)
- [x] Editar perfil (descripcion, WhatsApp, matricula, foto)
- [x] Ver resenas recibidas con rating visual
- [x] Estadisticas con tasa de conversion
- [x] Upload de foto de perfil

### Cliente
- [x] Buscar y contactar profesionales
- [x] Dejar resenas (logueado + invitado)
- [x] Pedir presupuesto por categoria
- [x] Instalar PWA (Android + iOS)

### Admin
- [x] Aprobar profesionales pendientes
- [x] Suspender/reactivar profesionales
- [x] 9 estadisticas de plataforma
- [x] Registrar profesional manualmente
- [x] Links a herramientas (Neon, Vercel)

### SEO y performance
- [x] Meta tags optimizados para Villa Maria, Cordoba
- [x] Estructura H1/H2 semantica
- [x] PWA manifest + Service Worker
- [x] Imagenes con lazy loading
- [x] Revalidacion ISR cada 60 segundos

---

## Roadmap (Fase 2)

- [ ] Suscripciones MercadoPago (planes Premium)
- [ ] Upload de fotos de trabajo (galeria completa)
- [ ] Notificaciones email (Resend)
- [ ] Notificaciones push (Web Push API)
- [ ] Chat entre cliente y profesional
- [ ] Geolocalizacion para busqueda por cercania
- [ ] App nativa (Expo / React Native)

---

## Licencia

Proyecto privado. Todos los derechos reservados.
© 2026 OficiosGo! — Villa Maria, Cordoba, Argentina.