import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";

export default async function FotosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center gap-3">
          <Link href="/app/cuenta" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-lg font-black text-[#F8C927]">Mis fotos de trabajo</h1>
        </div>
      </div>

      <div className="px-4 py-5 pb-24">
        {profile.photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-lg font-bold text-[#1A1D2E] mb-2">Todavia no subiste fotos</h3>
            <p className="text-sm text-gray-400 max-w-[260px] mx-auto mb-6">Las fotos de tus trabajos generan confianza y te ayudan a conseguir mas clientes</p>
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-4 border border-gray-100">Proximamente vas a poder subir fotos de tus trabajos directamente desde aca. Por ahora, contacta al administrador.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{profile.photos.length} foto{profile.photos.length !== 1 ? "s" : ""} de trabajos</p>
            <div className="grid grid-cols-2 gap-2">
              {profile.photos.map((photo, i) => (
                <div key={photo.url} className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={`Trabajo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}