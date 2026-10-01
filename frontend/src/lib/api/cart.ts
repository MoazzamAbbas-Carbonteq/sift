import { apiFetch } from "./client";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  freeShipping: boolean;
  inStock: boolean;
  quantity: number;
  lineTotalCents: number;
};

export type Cart = {
  id: string;
  items: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export const cartKeys = {
  all: ["cart"] as const,
};

export function fetchCart(): Promise<Cart> {
  return apiFetch<Cart>("/cart");
}

export function addCartItem(input: {
  productId: string;
  quantity: number;
}): Promise<Cart> {
  return apiFetch<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCartItem(id: string, quantity: number): Promise<Cart> {
  return apiFetch<Cart>(`/cart/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: string): Promise<Cart> {
  return apiFetch<Cart>(`/cart/items/${id}`, { method: "DELETE" });
}
