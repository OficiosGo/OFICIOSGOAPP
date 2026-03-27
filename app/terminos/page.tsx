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
          <h1 className="text-3xl font-black text-[#1A1D2E] mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-sm text-gray-400 mb-10">OficiosGo! — Última actualización: Marzo 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[15px] leading-relaxed text-gray-600">

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">1. Naturaleza del Servicio</h2>
              <p>OficiosGo! (en adelante, &quot;La Plataforma&quot;) es una herramienta tecnológica que funciona exclusivamente como un mercado de intermediación digital. Su función se limita a conectar a usuarios que requieren servicios técnicos u oficios (en adelante, &quot;Clientes&quot;) con trabajadores independientes o empresas que ofrecen dichos servicios (en adelante, &quot;Profesionales&quot;).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">2. Ausencia de Relación Laboral y Contractual</h2>
              <p>El Usuario reconoce y acepta que OficiosGo! no es una empresa de servicios técnicos, constructora, ni empleadora de los Profesionales registrados. No existe relación de dependencia, sociedad, ni mandato entre La Plataforma y los Profesionales. Cada contrato, acuerdo de precio o ejecución de obra es un vínculo jurídico privado y directo entre el Cliente y el Profesional.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">3. Exención de Responsabilidad por Servicios</h2>
              <p>OficiosGo! no garantiza, asegura ni se hace responsable bajo ningún concepto por:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Calidad del trabajo:</strong> Defectos técnicos, vicios ocultos o incumplimiento de expectativas en las tareas realizadas.</li>
                <li><strong>Daños materiales o hurtos:</strong> Cualquier daño a la propiedad privada, pérdida de bienes o actos ilícitos cometidos durante la prestación del servicio.</li>
                <li><strong>Comportamiento:</strong> Maltratos, falta de ética o conducta inapropiada por cualquiera de las partes.</li>
                <li><strong>Garantías:</strong> El cumplimiento de las garantías ofrecidas por el Profesional es responsabilidad exclusiva de este último.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">4. Limitación de Responsabilidad Civil y Penal</h2>
              <p>El Cliente asume la responsabilidad de verificar las credenciales y antecedentes del Profesional antes de permitirle el ingreso a su domicilio. OficiosGo! queda liberada de cualquier reclamo judicial o extrajudicial, daños y perjuicios, lucro cesante o daño emergente derivado de la interacción entre las partes. La Plataforma no interviene en las disputas ni en los pagos realizados fuera de sus sistemas previstos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">5. Verificación de Identidad y Opiniones</h2>
              <p>El sistema de carnet y opiniones de OficiosGo! se basa en información proporcionada por terceros y experiencias previas de otros usuarios. Si bien La Plataforma realiza esfuerzos por validar la identidad, esto no constituye una certificación de infalibilidad ni una garantía de buen desempeño futuro.</p>
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