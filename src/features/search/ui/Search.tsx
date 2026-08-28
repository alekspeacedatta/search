  import { useEffect, useMemo, useRef, useState } from "react";
  import { getProducts } from "../api/getProducts";
  import type { SearchResponseType } from "../types/response.type";
  import {
    type Category,
  } from "../../../shared/constants/categories.constants";
  import { debouncer } from "../../../shared/utils/debouncer";
  import { delay } from "../constants/delay.constant";
  import { handleParamChange } from "../utils/handleParamChange";
  import { usePopState } from "../hooks/usePopState";
  import { CustomInput } from "../../../shared/ui/CustomInput";
  import { CustomButton } from "../../../shared/ui/CustomButton";
  import { ProductCard } from "../../../shared/ui/ProductCard";
  import { getCount } from "../api/getCount";
import { getCategories } from "../api/getCategories";
import type { DebouncedFiltresArgumentsTypes } from "../types/filter.types";

  export const Search = () => {

    const [ categories, setCategories ] = useState<Category[]>([]);
    const [ count, setCount ] = useState<number>(0);
    const [data, setData] = useState<SearchResponseType | undefined>(undefined);
    
    const { filters, updateFilters } = usePopState();
    const { q, selectedCategories, minPrice, maxPrice } = filters;

    const latestSeq = useRef(0);

    const controllerRef = useRef<AbortController | null>(null);
    const resultsArrivedRef = useRef(false);

    const debouncedGetProducts = useMemo(
      () =>
        debouncer(
          (  data : DebouncedFiltresArgumentsTypes) => {
            const { seq, ...payload } = data;
            getProducts(payload).then((data) => {
              if (seq === latestSeq.current) {
                setData(data);
                if (data) {
                  setCount(data.results.length); 
                  resultsArrivedRef.current = true;
                }
              }
            });
          },
          delay,
        ),
      [],
    );
    const debouncedGetCount = useMemo(
      () =>
        debouncer(
          (data: DebouncedFiltresArgumentsTypes) => {
            const { seq, ...payload } = data;
            getCount(payload).then((total) => {
              if (seq === latestSeq.current && !resultsArrivedRef.current) {
                setCount(total);
              }
            })
            .catch(console.error);
          },
          delay,
        ),
      [],
    );

    useEffect(() => {
      const mySeq = ++latestSeq.current;
      resultsArrivedRef.current = false;  

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const data = {selectedCategories, q, minPrice, maxPrice, seq: mySeq, signal: controller.signal};

      debouncedGetProducts(data);
      debouncedGetCount(data);

      getCategories().then(setCategories).catch(console.error)
      
    }, [selectedCategories, q, minPrice, maxPrice]);

    const handleCategorySelect = (category: Category) => () => {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((item) => item !== category)
        : [...selectedCategories, category];
      updateFilters({ selectedCategories: newCategories });
      handleParamChange(newCategories, "categories");
    };

    if (data === undefined) return null;
    if (count === undefined) return null;

    const { results } = data;

    return (
      <div className="flex flex-col md:flex-row items-start ">
        <div className="flex flex-col gap-4 flex-1 p-4 h-fit border border-gray-200 m-4 bg-white rounded-xl shadow-md sticky top-4">
          <h2 className="font-bold text-xl">Search for a product</h2>
          <p><span className="text-sm font-semibold">total: </span> {count}</p>
          <CustomInput
            value={q}
            placeholder="search for a product"
            onChange={(e) => {
              handleParamChange(e.target.value, "q");
              updateFilters({ q: e.target.value });
            }}
          />

          <div className="grid grid-cols items-center gap-3">
            <CustomInput
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                updateFilters({ minPrice: e.target.value });
                handleParamChange(e.target.value, "minPrice");
              }}
            />
            <CustomInput
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                updateFilters({ maxPrice: e.target.value });
                handleParamChange(e.target.value, "maxPrice");
              }}
            />

            {categories.map((category: Category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <CustomButton
                  isSelected={isSelected}
                  key={category}
                  onClick={handleCategorySelect(category)}
                >
                  {category}
                </CustomButton>
              );
            })}
          </div>
        </div>
        <div className="flex-12 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 rounded-md  p-4">
          {results.map(item => 
              <ProductCard
                key={item.id}
                {...item}
              />
          )}
        </div>
      </div>
    );
  };
