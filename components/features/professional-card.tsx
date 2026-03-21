import Link from "next/link";

type Props = {
  profile: {
    id: string;
    slug: string;
    headline: string | null;
    city: string;
    yearsExperience: number | null;
    tier: string;
    averageRating: number;
    totalReviews: number;
    matricula: string | null;
    user: { name: string };
    category: { name: string; slug: string; icon: string | null };
    photos: { url: string }[];
  };
};

export function ProfessionalCard({ profile }: Props) {
  const isPremium = profile.tier === "PREMIUM";
  const isStandard = profile.tier === "STANDARD";

  return (
    <Link
      href={`/profesional/${profile.slug}`}
      className={`block rounded-2xl overflow-hidden bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isPremium ? "border-2 border-brand-gold" : "border border-gray-200"
      }`}
    >
      {profile.photos[0] && (
        <div className="h-40 overflow-hidden relative">
          <img
            src={profile.photos[0].url}
            alt={`Trabajo de ${profile.user.name}`}
            className="w-full h-full object-cover"
          />
          {(isPremium || isStandard) && (
            <span
              className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                isPremium
                  ? "bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-black"
                  : "bg-brand-blue text-white"
              }`}
            >
              {isPremium ? "★ Premium" : "Standard"}
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-blue to-brand-olive flex items-center justify-center text-white text-sm font-black shrink-0">
            {profile.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-brand-black truncate">{profile.user.name}</h3>
            <p className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              {profile.category.icon} {profile.category.name}
              {profile.matricula && (
                <span className="text-brand-olive ml-1">✓ Matriculado</span>
              )}
            </p>
          </div>
        </div>

        {profile.headline && (
          <p className="text-sm text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
            {profile.headline}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-brand-gold">★</span>
            <span className="text-sm font-bold">{profile.averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({profile.totalReviews})</span>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>{profile.city}</span>
            {profile.yearsExperience && <span>· {profile.yearsExperience} años</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
