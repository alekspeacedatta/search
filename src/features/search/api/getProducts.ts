import { SEARCH } from "../../../shared/api/api-endpoints";
import { ENV } from "../../../shared/config/ENV";
import type { FiltresPayLoad } from "../types/filter.types";
import type { SearchResponseType } from "../types/response.type";
import { raceForAbortOrRetry } from "../utils/raceForAbortOrRetry";

export const getProducts = async (
  payLoad: FiltresPayLoad
): Promise<SearchResponseType | undefined> => {
  const { ...rest } = payLoad;
  const { signal } = payLoad;
  const MAX_TRIES = 2;
  try {
    for (let i = 0; i <= MAX_TRIES; i++) {
      const response = await fetch(
        `${ENV.BASE_URL}${SEARCH.SEARCH({name: 'search', ...rest})}`,
        { signal },
      );
      if (response.status === 503 && i < MAX_TRIES) {
        await raceForAbortOrRetry(signal, i);
        continue;
      }
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      } 
      const data: SearchResponseType = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};