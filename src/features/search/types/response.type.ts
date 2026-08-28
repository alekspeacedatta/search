import type { ProductType } from "../../../shared/types/product.type"

export type SearchResponseType = {
    total: number,
    results: ProductType[]
}