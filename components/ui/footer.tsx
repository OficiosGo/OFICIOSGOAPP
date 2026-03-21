import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0d0e14] text-white pt-12 pb-6 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8C927] flex items-center justify-center text-xs font-black text-[#1A1D2E]">Go</div>
            <span className="text-lg font-black italic">Oficios<span className="text-[#F5A623]">Go!</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            El marketplace de oficios de Villa María. Profesionales verificados a un clic.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-3">Oficios</h4>
          <div className="flex flex-col gap-1.5">
            {["Electricista", "Plomero", "Carpintero", "Pintor", "Gasista"].map(c => (
              <Link key={c} href="/buscar" className="text-sm text-gray-400 hover:text-white transition-colors">{c}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-3">Profesionales</h4>
          <div className="flex flex-col gap-1.5">
            <Link href="/registro" className="text-sm text-gray-400 hover:text-white transition-colors">Registrate gratis</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Mi Panel</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-3">Contacto</h4>
          <div className="flex flex-col gap-1.5 text-sm text-gray-400">
            <span>Villa María, Córdoba</span>
            <span>info@oficiosgo.com</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} OficiosGo! — Todos los derechos reservados
      </div>
    </footer>
  );
}
