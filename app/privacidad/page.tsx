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
          <p className="text-sm text-gray-400 mb-10">OficiosGo! — Última actualización: Marzo 2026</p>

          <div className="prose prose-gray max-w-none space-y-6 text-[15px] leading-relaxed text-gray-600">

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">1. Recolección de Información</h2>
              <p>Para el funcionamiento de la app, OficiosGo! recopila datos personales que los usuarios proporcionan voluntariamente:</p>
              <h3 className="text-base font-bold text-[#1A1D2E] mt-4 mb-2">Profesionales:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre completo, DNI/Pasaporte, fotografía para el carnet</li>
                <li>Especialidad, geolocalización, antecedentes (si se solicitan)</li>
                <li>Datos de contacto</li>
              </ul>
              <h3 className="text-base font-bold text-[#1A1D2E] mt-4 mb-2">Clientes:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre, ubicación de la solicitud de servicio y datos de contacto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">2. Uso de los Datos</h2>
              <p>La información recolectada tiene como fin exclusivo:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Validar la identidad del profesional para la emisión del Carnet Identificatorio</li>
                <li>Permitir el contacto directo entre Cliente y Profesional para la prestación del servicio</li>
                <li>Mantener el sistema de opiniones y reputación basado en experiencias reales</li>
                <li>Enviar notificaciones de seguridad o actualizaciones del servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">3. Divulgación de Datos a Terceros</h2>
              <p>OficiosGo! no vende ni alquila datos personales a terceros. Sin embargo, el Usuario acepta que:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Su nombre, foto y reputación serán públicos dentro de la plataforma y visibles al escanear el Código QR del carnet</li>
                <li>Los datos de contacto (teléfono/WhatsApp) serán revelados a la contraparte una vez que se acepte un presupuesto o solicitud de servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">4. Seguridad del Carnet Identificatorio</h2>
              <p>El carnet generado por la app es una herramienta de confianza. Los datos contenidos en el QR son almacenados en servidores seguros. El Profesional es responsable de la custodia de su carnet físico/digital y de no permitir que terceros lo utilicen para suplantar su identidad.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">5. Derechos del Usuario (ARCO)</h2>
              <p>Todo usuario tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Acceder</strong> a sus datos almacenados</li>
                <li><strong>Rectificar</strong> información inexacta</li>
                <li><strong>Cancelar/Eliminar</strong> su cuenta y datos personales cuando lo desee, lo cual revocará automáticamente la validez de su carnet de profesional</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1A1D2E] mt-8 mb-3">6. Geolocalización</h2>
              <p>La app utiliza servicios de ubicación para conectar al profesional más cercano con el cliente. Estos datos solo se utilizan mientras la app está en uso o según la configuración de privacidad del dispositivo del usuario.</p>
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