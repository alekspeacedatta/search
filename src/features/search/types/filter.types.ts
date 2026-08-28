import type { Category } from "../../../shared/constants/categories.constants";

export type Filtres = {
  q: string;
  selectedCategories: Category[];
  minPrice: string;
  maxPrice: string;
};
export type DebouncedFiltresArgumentsTypes = {
  seq: number,
  signal: AbortSignal
} & Filtres

export type FiltresPayLoad =  Omit<DebouncedFiltresArgumentsTypes, 'seq'>;

export type FiltresWithName = FiltresPayLoad & { name: string }