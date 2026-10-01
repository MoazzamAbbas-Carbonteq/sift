"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  cartKeys,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: fetchCart,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
    },
  });
}
