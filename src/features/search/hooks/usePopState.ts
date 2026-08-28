import { useEffect, useState } from "react"
import type { Filtres } from "../types/filter.types";
import { readParamsFromUrl } from "../utils/readParamsFromUrl";

export const usePopState = () => {
    const [ filters, setFilters ] = useState<Filtres>(readParamsFromUrl);

    const updateFilters = (partial: Partial<Filtres>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    };

    useEffect(() => {
      const handlePopState = () => setFilters(readParamsFromUrl());
        
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }, [])

    return {
        filters, updateFilters
    }
}