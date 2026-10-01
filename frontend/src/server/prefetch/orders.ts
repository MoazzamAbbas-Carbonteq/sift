import type { QueryClient } from "@tanstack/react-query";
import { fetchOrder, fetchOrders, orderKeys } from "@/lib/api/orders";

export function prefetchOrders(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: orderKeys.list(),
    queryFn: fetchOrders,
  });
}

export function prefetchOrder(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
  });
}
