import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ContactButtons } from "@/components/features/contact-buttons";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await professionalRepository.getBySlug(slug);
  if (!profile) return { title: "No encontrado" };
  return {
    title: `${profile.user.name} — ${profile.category.name}`,
    description: profile.headline ?? `${profile.category.name} en ${profile.city}`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await professionalRepository.getBySlug(slug);
  if (!profile) notFound();

  professionalRepository.incrementViews(profile.id).catch(() => {});

  const isPremium = profile.tier === "PREMIUM";

  return (
    <div className="pb-6">
      {/* Hero image */}
      <div className="relative h-[260px] bg-gray-200">
        {profile.photos[0] ? (
          <img src={profile.photos[0].url} alt={`Trabajo de ${profile.user.name}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1D2E] to-[#252839]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <Link href="/app/buscar" className="absolute top-3.5 left-3.5 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        {/* Photo dots */}
        {profile.photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {profile.photos.slice(0, 5).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#F8C927]" : "bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Profile card (overlapping) */}
      <div className="mx-4 -mt-10 relative z-10">
        <div className={`rounded-[20px] bg-white p-5 shadow-lg ${isPremium ? "border-2 border-[#F8C927]" : "border border-gray-200"}`}>
          <div className="flex gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md border-[3px] border-white">
              {profile.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-[#1A1D2E]">{profile.user.name}</h1>
                {isPremium && (
                  <span className="text-[9px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#1A1D2E] px-2 py-0.5 rounded-lg uppercase">★ Premium</span>
                )}
              </div>
              <p className="text-[13px] text-[#5C80BC] font-semibold mt-0.5">{profile.headline}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[#F8C927]">★</span>
                <span className="text-sm font-black">{profile.averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({profile.totalReviews} reseñas)</span>
              </div>
              {profile.matricula && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#7A9263"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
                  <span className="text-[11px] text-[#7A9263] font-semibold">{profile.matricula}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-5">
            <ContactButtons
              profileId={profile.id}
              whatsapp={profile.whatsapp}
              phone={profile.user.phone}
              name={profile.user.name.split(" ")[0]}
            />
          </div>
        </div>
      </div>

      {/* About */}
      {profile.bio && (
        <div className="mx-4 mt-3 p-4 rounded-2xl bg-white border border-gray-200">
          <h3 className="text-[15px] font-extrabold text-[#1A1D2E] mb-2">Sobre {profile.user.name.split(" ")[0]}</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">📍 {profile.city}</span>
            {profile.availability && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">🕐 {profile.availability}</span>
            )}
            {profile.yearsExperience && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">🔨 {profile.yearsExperience} años exp.</span>
            )}
          </div>
        </div>
      )}

      {/* Reviews */}
      {profile.reviews.length > 0 && (
        <div className="mx-4 mt-3 p-4 rounded-2xl bg-white border border-gray-200">
          <h3 className="text-[15px] font-extrabold text-[#1A1D2E] mb-3">Reseñas ({profile.reviews.length})</h3>
          <div className="divide-y divide-gray-100">
            {profile.reviews.map((rev) => (
              <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1A1D2E]">{rev.author.name}</span>
                  <span className="text-[10px] text-gray-400">{formatDate(rev.createdAt)}</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= rev.rating ? "text-[#F8C927]" : "text-gray-200"}`}>★</span>)}
                </div>
                {rev.comment && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{rev.comment}</p>}
                {rev.response && (
                  <div className="mt-2 p-2.5 rounded-xl bg-yellow-50 border-l-2 border-[#F8C927] text-xs text-gray-600">
                    <strong className="text-[#1A1D2E]">Respuesta:</strong> {rev.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
