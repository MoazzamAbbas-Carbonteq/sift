import type { QueryClient } from "@tanstack/react-query";
import { cartKeys, fetchCart } from "@/lib/api/cart";

export function prefetchCart(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: cartKeys.all,
    queryFn: fetchCart,
  });
}
