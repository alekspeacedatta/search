import type { Category } from "../constants/categories.constants";

export type ProductType = {
  id: number;
  name: string;
  category: Category;
  price: number;
};
