import { isString } from "../../../shared/utils/isString";
import type { Filtres } from "../types/filter.types";

export const readParamsFromUrl = () : Filtres => {
    const params = new URLSearchParams(window.location.search);
    const categories = params.get('categories')?.split(',').filter(isString) ?? [];

    return {
        selectedCategories: categories,
        minPrice: params.get('minPrice') ?? '',
        maxPrice: params.get('maxPrice') ?? '',
        q: params.get('q') ?? '',
    } 
}