import Link from "next/link";
import { LandingNavbar } from "@/components/ui/landing-navbar";
import { Footer } from "@/components/ui/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
};

export default function TerminosPage() {
  return (
    <>
      <LandingNavbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-[#1A1D2E] mb-2">Términos y Condiciones</h1>
          <p className="text-sm text-gray-400 mb-10">Última actualización: Marzo 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[15px] leading-relaxed text-gray-600">

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar la plataforma OficiosGo! (en adelante, &quot;la Plataforma&quot;), ya sea a través del sitio web, la aplicación móvil (PWA) o cualquier servicio relacionado, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar la Plataforma.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">2. Descripción del Servicio</h2>
              <p>OficiosGo! es un marketplace digital que conecta profesionales de oficios (electricistas, plomeros, carpinteros, pintores, gasistas, albañiles, cerrajeros, techistas, jardineros y técnicos de aire acondicionado) con clientes que requieren sus servicios en la ciudad de Villa María, Córdoba, Argentina y zonas de cobertura.</p>
              <p>La Plataforma actúa exclusivamente como intermediaria facilitando el contacto entre profesionales y clientes. OficiosGo! no es parte de la relación contractual entre el profesional y el cliente, ni garantiza la calidad, seguridad o legalidad de los servicios prestados.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">3. Registro de Profesionales</h2>
              <p>Para registrarse como profesional en la Plataforma, el usuario debe:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Ser mayor de 18 años</li>
                <li>Proporcionar datos veraces y actualizados, incluyendo nombre completo, DNI, fecha de nacimiento, email y teléfono</li>
                <li>Contar con las habilitaciones, matrículas o permisos correspondientes a su oficio cuando la normativa vigente lo requiera</li>
                <li>Aceptar el proceso de verificación y aprobación por parte del equipo de OficiosGo!</li>
              </ul>
              <p className="mt-3">El profesional es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda actividad realizada con su cuenta.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">4. Uso por parte de Clientes</h2>
              <p>Los clientes pueden utilizar la Plataforma para buscar profesionales y solicitar presupuestos sin necesidad de registrarse. Al enviar un pedido de presupuesto, el cliente:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Acepta que sus datos de contacto (nombre y teléfono) serán compartidos con los profesionales de la categoría seleccionada</li>
                <li>Se compromete a proporcionar información veraz sobre el servicio requerido</li>
                <li>Entiende que la contratación del servicio es directa con el profesional, sin intermediación de OficiosGo!</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">5. Planes y Suscripciones</h2>
              <p>La Plataforma ofrece distintos niveles de suscripción para profesionales (Free, Standard, Premium). Las condiciones, precios y beneficios de cada plan se detallan en la sección correspondiente de la Plataforma y pueden ser modificados con previo aviso de 30 días.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">6. Reseñas y Contenido</h2>
              <p>Los usuarios pueden publicar reseñas sobre los profesionales. Las reseñas deben ser veraces, respetuosas y basadas en experiencias reales. OficiosGo! se reserva el derecho de moderar, editar o eliminar contenido que considere inapropiado, ofensivo, falso o que viole estos términos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">7. Limitación de Responsabilidad</h2>
              <p>OficiosGo! no es responsable por:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>La calidad, seguridad o resultado de los servicios prestados por los profesionales</li>
                <li>Daños directos o indirectos derivados de la contratación de servicios a través de la Plataforma</li>
                <li>La veracidad de la información proporcionada por profesionales o clientes</li>
                <li>Interrupciones temporales del servicio por mantenimiento o causas de fuerza mayor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">8. Propiedad Intelectual</h2>
              <p>Todo el contenido de la Plataforma (diseño, logotipos, textos, código fuente, imágenes) es propiedad de OficiosGo! o sus licenciantes y está protegido por las leyes de propiedad intelectual vigentes en la República Argentina.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">9. Suspensión y Cancelación</h2>
              <p>OficiosGo! se reserva el derecho de suspender o cancelar cuentas de profesionales que incumplan estos términos, proporcionen información falsa, reciban reiteradas quejas de clientes o realicen un uso indebido de la Plataforma.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">10. Modificaciones</h2>
              <p>OficiosGo! puede modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a los usuarios registrados y publicados en esta página. El uso continuado de la Plataforma después de las modificaciones implica la aceptación de los nuevos términos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">11. Ley Aplicable y Jurisdicción</h2>
              <p>Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los tribunales ordinarios de la ciudad de Villa María, provincia de Córdoba.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">12. Contacto</h2>
              <p>Para consultas sobre estos Términos y Condiciones, puede contactarnos a través de: <strong>info@oficiosgo.com</strong></p>
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