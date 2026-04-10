import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { profiles: number };
};

type Props = {
  categories: Category[];
};

export function CategoryGrid({ categories }: Props) {
  return (
    <div className="px-4 pt-5 pb-24">
      <p className="text-[13px] text-gray-400 mb-4 font-medium">
        {categories.length} categorías disponibles
      </p>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/app/buscar?category=${cat.slug}`}
            prefetch={true}
            className="group relative overflow-hidden rounded-2xl p-5 border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform"
            style={{ touchAction: "manipulation" }}
            aria-label={`Ver ${cat.name}, ${cat._count.profiles} profesionales`}
          >
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-[#F8C927]/10" />
            <div className="text-3xl mb-2 relative z-10" aria-hidden="true">
              {cat.icon}
            </div>
            <div className="text-[14px] font-extrabold text-[#0F1120] leading-tight relative z-10">
              {cat.name}
            </div>
            <div className="text-[11px] text-gray-400 mt-1 font-medium relative z-10">
              {cat._count.profiles}{" "}
              {cat._count.profiles !== 1 ? "profesionales" : "profesional"}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8C927] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        ))}
      </div>
    </div>
  );
}