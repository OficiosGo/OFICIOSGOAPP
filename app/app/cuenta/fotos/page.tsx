import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { WorkPhotosManager } from "@/components/features/work-photos-manager";

export const dynamic = "force-dynamic";

export default async function FotosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  const photos = profile.photos.map((p) => ({ id: p.id, url: p.url }));

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center gap-3">
          <Link href="/app/cuenta" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-lg font-black text-[#F8C927]">Mis fotos de trabajo</h1>
        </div>
        <p className="text-[13px] text-white/50 mt-1.5 ml-12">Mostrá tus mejores trabajos. Hasta 12 fotos.</p>
      </div>

      <div className="px-4 py-5 pb-24">
        <WorkPhotosManager initialPhotos={photos} />
      </div>
    </>
  );
}