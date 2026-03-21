import { professionalRepository } from "@/server/repositories/professional.repository";
import { TIER_ORDER } from "@/lib/constants";
import type { ProfessionalFilters } from "@/types";

export const searchService = {
  async search(filters: ProfessionalFilters) {
    const result = await professionalRepository.search(filters);

    // If no geo, apply premium boost sort (geo search already sorts by tier+distance in SQL)
    const hasGeo = filters.lat != null && filters.lng != null;
    if (!hasGeo) {
      result.data.sort((a, b) => {
        const tierA = TIER_ORDER[a.tier] ?? 2;
        const tierB = TIER_ORDER[b.tier] ?? 2;
        if (tierA !== tierB) return tierA - tierB;
        return b.averageRating - a.averageRating;
      });
    }

    return result;
  },

  async getFeatured(limit = 6) {
    return professionalRepository.getFeatured(limit);
  },
};
