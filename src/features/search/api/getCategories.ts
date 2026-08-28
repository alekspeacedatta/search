import { SEARCH } from "../../../shared/api/api-endpoints"
import { ENV } from "../../../shared/config/ENV"
import type { Category } from "../../../shared/constants/categories.constants";
import { fetchJson } from "../../../shared/utils/fetchJson";
import { hasKey } from "../../../shared/utils/hasKey";
import { isArrayOf } from "../../../shared/utils/isArrayOf";
import { isString } from "../../../shared/utils/isString";


const isCategoriesResponse = hasKey('categories', isArrayOf(isString))

export const getCategories = async () : Promise<Category[]> => 
    fetchJson(`${ENV.BASE_URL}${SEARCH.CATEGORIES}`, isCategoriesResponse)
      .then((data) => data.categories);
