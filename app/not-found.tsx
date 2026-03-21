import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-5 pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-black text-brand-black mb-2">Página no encontrada</h1>
          <p className="text-gray-500 mb-6">La página que buscás no existe o fue movida.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-brand-black text-brand-yellow font-bold hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}
