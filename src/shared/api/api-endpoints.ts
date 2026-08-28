import { buildSearchQuery } from "../utils/buildSearchQuery";

export const SEARCH = {
  SEARCH: buildSearchQuery,
  COUNT: buildSearchQuery,
  CATEGORIES: "categories",
} as const;
