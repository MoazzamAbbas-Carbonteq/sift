"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/lib/api/cart";
import {
  fetchOrder,
  fetchOrders,
  orderKeys,
  placeOrder,
  type PlaceOrderInput,
} from "@/lib/api/orders";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: fetchOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order);
      void queryClient.invalidateQueries({ queryKey: orderKeys.list() });
      void queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
