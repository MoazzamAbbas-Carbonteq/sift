import type { CartProductSnapshot, CartRecord } from '../cart.js';

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');

export interface CartRepository {
  findActiveCart(): Promise<CartRecord | null>;
  findProduct(productId: string): Promise<CartProductSnapshot | null>;
  insertLine(cartId: string, productId: string, quantity: number): Promise<void>;
  updateLineQuantity(lineId: string, quantity: number): Promise<void>;
  deleteLine(lineId: string): Promise<void>;
}
