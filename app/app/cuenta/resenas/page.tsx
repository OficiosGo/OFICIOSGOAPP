import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { db } from "@/db/client";
import { formatDate } from "@/lib/utils";

export default async function OpinionesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  const reviews = await db.review.findMany({
    where: { profileId: profile.id, isVisible: true, deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="bg-[#1A1D2E] px-5 pt-4 pb-5 rounded-b-[20px]">
        <div className="flex items-center gap-3">
          <Link href="/app/cuenta" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-lg font-black text-[#F8C927]">Mis opiniones</h1>
        </div>
      </div>

      <div className="px-4 py-5 pb-24">
        {/* Summary */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
          <div className="text-center">
            <div className="text-3xl font-black text-[#1A1D2E]">{profile.averageRating.toFixed(1)}</div>
            <div className="flex gap-0.5 mt-1 justify-center">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 12 12" fill={s <= Math.round(profile.averageRating) ? "#F8C927" : "#E5E7EB"}>
                  <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#1A1D2E]">{reviews.length} opinión{reviews.length !== 1 ? "s" : ""}</div>
            <div className="text-xs text-gray-400">de clientes verificados</div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-lg font-bold text-[#1A1D2E] mb-2">Todavia no tenes opiniones</h3>
            <p className="text-sm text-gray-400">Cuando un cliente te deje una opinión, va a aparecer aca</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1A1D2E]/10 flex items-center justify-center text-xs font-black text-[#1A1D2E]">{rev.author.name.charAt(0)}</div>
                    <span className="text-sm font-bold text-[#1A1D2E]">{rev.author.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{formatDate(rev.createdAt)}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 12 12" fill={s <= rev.rating ? "#F8C927" : "#E5E7EB"}>
                      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
                    </svg>
                  ))}
                </div>
                {rev.comment && <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>}
                {rev.response && (
                  <div className="mt-2 p-3 rounded-xl bg-[#FFFBEA] border-l-2 border-[#F8C927] text-xs text-gray-600">
                    <strong className="text-[#1A1D2E]">Tu respuesta:</strong> {rev.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}