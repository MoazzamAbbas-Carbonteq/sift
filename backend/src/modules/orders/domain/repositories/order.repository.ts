import type { CheckoutCart, OrderDraft, OrderRecord } from '../order.js';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepository {
  place(build: (cart: CheckoutCart) => Promise<OrderDraft> | OrderDraft): Promise<OrderRecord>;
  listForDemoUser(): Promise<OrderRecord[]>;
  findForDemoUser(orderId: string): Promise<OrderRecord | null>;
}
