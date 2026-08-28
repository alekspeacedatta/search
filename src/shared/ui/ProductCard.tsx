import type { ProductType } from "../types/product.type"

export const ProductCard = ({ name, category, price } : ProductType) => {
  return (
    <div className="rounded-md shadow-sm hover:scale-[101%] cursor-pointer h-fit border-gray-200 border p-4">
        <h3>
            <span className="font-bold text-gray-400 text-xs">Name:</span> {name}
        </h3>
        <p>
            <span className="font-bold text-gray-400 text-xs">Category:</span> {category}
        </p>
        <p>
            <span className="font-bold text-gray-400 text-xs">Price:</span> {price}₾
        </p>
    </div>
  )
}
