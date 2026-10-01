import type { QueryClient } from "@tanstack/react-query";
import { categoryKeys, fetchCategories } from "@/lib/api/categories";

export function prefetchCategories(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: categoryKeys.all,
    queryFn: fetchCategories,
  });
}
