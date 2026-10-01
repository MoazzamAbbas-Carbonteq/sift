import type { QueryClient } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchProducts,
  productKeys,
  type ProductQuery,
} from "@/lib/api/products";

export function prefetchProducts(queryClient: QueryClient, query: ProductQuery) {
  return queryClient.prefetchQuery({
    queryKey: productKeys.list(query),
    queryFn: () => fetchProducts(query),
  });
}

export function prefetchProduct(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
  });
}
