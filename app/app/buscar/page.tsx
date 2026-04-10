import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { searchService } from "@/server/services/search.service";
import { categoryRepository } from "@/server/repositories/category.repository";
import { SearchBar } from "./_components/search-bar";
import { ResultsList } from "./_components/results-list";
import { CategoryGrid } from "./_components/category-grid";

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

// Cache categories for 5 minutes — they barely change
const getCachedCategories = unstable_cache(
  async () => categoryRepository.getAll(),
  ["categories-all"],
  { revalidate: 300, tags: ["categories"] }
);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categories = await getCachedCategories();
  const selected = params.category
    ? categories.find((c) => c.slug === params.category)
    : null;
  if (selected) {
    return {
      title: `${selected.name} en Villa María y Villa Nueva | OficiosGo`,
      description: `Encontrá ${selected.name.toLowerCase()} verificados en Villa María y Villa Nueva, Córdoba. Opiniones reales, contacto directo.`,
    };
  }
  return {
    title: "Buscar profesionales en Villa María y Villa Nueva | OficiosGo",
    description:
      "Buscá plomeros, electricistas, pintores y más en Villa María y Villa Nueva, Córdoba.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const query = params.q || null;
  const hasSearch = !!(category || query);

  const [categories, result] = await Promise.all([
    getCachedCategories(),
    hasSearch
      ? searchService.search({ category, query, page: 1, limit: 20 })
      : Promise.resolve(null),
  ]);

  const selectedCategory = category
    ? categories.find((c) => c.slug === category) ?? null
    : null;

  return (
    <>
      <SearchBar
        categories={categories}
        initialQuery={query}
        initialCategory={category}
        selectedCategory={selectedCategory}
        totalResults={result?.total ?? null}
        hasSearch={hasSearch}
      />

      {!hasSearch && <CategoryGrid categories={categories} />}

      {hasSearch && result && (
        <div className="px-4 pt-4 pb-24">
          <ResultsList
            initialResult={result}
            category={category}
            query={query}
          />
        </div>
      )}

      <div className="h-24" />
    </>
  );
}