import type { FiltresWithName } from "../../features/search/types/filter.types";

export const buildSearchQuery = (
    filters : FiltresWithName
) => {
  const { selectedCategories, minPrice, maxPrice, q, name, } = filters;
  const params = new URLSearchParams();

  if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `${name}?${query}` : name;
};