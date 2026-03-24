import Link from "next/link";
import { LandingNavbar } from "@/components/ui/landing-navbar";
import { Footer } from "@/components/ui/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
};

export default function PrivacidadPage() {
  return (
    <>
      <LandingNavbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-[#1A1D2E] mb-2">Política de Privacidad</h1>
          <p className="text-sm text-gray-400 mb-10">Última actualización: Marzo 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[15px] leading-relaxed text-gray-600">

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">1. Responsable del Tratamiento</h2>
              <p>OficiosGo! con domicilio en Villa María, Córdoba, Argentina, es responsable del tratamiento de los datos personales recopilados a través de la Plataforma, en cumplimiento de la Ley N° 25.326 de Protección de Datos Personales y su decreto reglamentario.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">2. Datos que Recopilamos</h2>
              <h3 className="text-base font-bold text-[#1A1D2E] mt-4 mb-2">2.1 Profesionales (al registrarse):</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre completo</li>
                <li>Documento Nacional de Identidad (DNI)</li>
                <li>Fecha de nacimiento</li>
                <li>Dirección de email</li>
                <li>Número de teléfono / WhatsApp</li>
                <li>Categoría de oficio y experiencia</li>
                <li>Ciudad y zona de cobertura</li>
                <li>Matrícula profesional (cuando aplique)</li>
                <li>Fotografías de trabajos realizados</li>
              </ul>
              <h3 className="text-base font-bold text-[#1A1D2E] mt-4 mb-2">2.2 Clientes (al solicitar presupuesto):</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre</li>
                <li>Número de teléfono / WhatsApp</li>
                <li>Email (opcional)</li>
                <li>Descripción del servicio requerido</li>
              </ul>
              <h3 className="text-base font-bold text-[#1A1D2E] mt-4 mb-2">2.3 Datos de navegación:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ubicación geográfica (solo cuando el usuario lo autoriza)</li>
                <li>Datos de uso de la plataforma (vistas, contactos, búsquedas)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">3. Finalidad del Tratamiento</h2>
              <p>Los datos personales son recopilados y tratados con las siguientes finalidades:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Facilitar la conexión entre profesionales y clientes</li>
                <li>Verificar la identidad de los profesionales registrados</li>
                <li>Gestionar las cuentas de usuario y suscripciones</li>
                <li>Enviar notificaciones relacionadas con el servicio</li>
                <li>Mejorar la experiencia de uso de la Plataforma</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">4. Compartición de Datos</h2>
              <p>Al solicitar un presupuesto, los datos de contacto del cliente (nombre y teléfono) se comparten con los profesionales de la categoría elegida para facilitar la comunicación directa.</p>
              <p className="mt-2">No vendemos, alquilamos ni compartimos datos personales con terceros para fines publicitarios o comerciales ajenos a la Plataforma.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">5. Seguridad</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger los datos personales:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Contraseñas almacenadas con hash bcrypt (nunca en texto plano)</li>
                <li>Conexiones cifradas mediante HTTPS/TLS</li>
                <li>Autenticación mediante tokens JWT en cookies HttpOnly</li>
                <li>Base de datos con acceso restringido y cifrado en tránsito</li>
                <li>Headers de seguridad (HSTS, CSP, X-Frame-Options)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">6. Derechos del Titular</h2>
              <p>De acuerdo con la Ley N° 25.326, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Acceso:</strong> conocer qué datos personales suyos se encuentran en nuestra base de datos</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos en determinadas circunstancias</li>
              </ul>
              <p className="mt-3">Para ejercer estos derechos, contacte a: <strong>info@oficiosgo.com</strong></p>
              <p className="mt-2 text-sm">La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas de protección de datos personales.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">7. Conservación de Datos</h2>
              <p>Los datos personales se conservan mientras la cuenta del usuario permanezca activa o sea necesario para prestar el servicio. Los datos de pedidos de presupuesto se conservan por un período máximo de 12 meses.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">8. Geolocalización</h2>
              <p>La función &quot;Cerca de mí&quot; utiliza la ubicación del dispositivo exclusivamente para ordenar resultados por proximidad. La ubicación no se almacena en nuestros servidores. El usuario puede activar o desactivar esta función en cualquier momento.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">9. Contacto</h2>
              <p><strong>Email:</strong> info@oficiosgo.com</p>
              <p><strong>Dirección:</strong> Villa María, Córdoba, Argentina</p>
            </section>

          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href="/" className="text-sm text-[#5C80BC] font-semibold hover:underline">← Volver al inicio</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}