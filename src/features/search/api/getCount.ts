import { SEARCH } from "../../../shared/api/api-endpoints";
import { ENV } from "../../../shared/config/ENV";
import { fetchJson } from "../../../shared/utils/fetchJson";
import { isNumber } from "../../../shared/utils/isNumber";
import type { FiltresPayLoad } from "../types/filter.types";

export const getCount = async (
    payload: FiltresPayLoad
): Promise<number> => {
    const { ...rest } = payload
    const { signal } = payload
    return (
        fetchJson(`${ENV.BASE_URL}${SEARCH.COUNT({...rest, name: 'count'})}`, isNumber, {signal})
            .then(data => data)
    )
}
