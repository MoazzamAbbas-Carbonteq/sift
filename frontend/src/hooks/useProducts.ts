"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  productKeys,
  type ProductQuery,
} from "@/lib/api/products";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => fetchProducts(query),
    placeholderData: keepPreviousData,
  });
}
