import { apiFetch } from "./client";

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type Order = {
  id: string;
  status: "placed";
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingName: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
};

export type PlaceOrderInput = {
  shippingName: string;
  shippingAddress: string;
};

export const orderKeys = {
  all: ["orders"] as const,
  list: () => ["orders", "list"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}

export function fetchOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export function placeOrder(input: PlaceOrderInput): Promise<Order> {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
