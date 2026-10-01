import { calculateOrderTotals } from '../../../common/order-totals.js';
import type { CartRecord } from '../domain/cart.js';
import type { CartResponseDto } from './dto/cart-response.dto.js';

export function toCartResponse(cart: CartRecord): CartResponseDto {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    imageUrl: item.product.imageUrl,
    priceCents: item.product.priceCents,
    freeShipping: item.product.freeShipping,
    inStock: item.product.inStock,
    quantity: item.quantity,
    lineTotalCents: item.product.priceCents * item.quantity,
  }));
  const totals = calculateOrderTotals(
    items.map((item) => ({
      priceCents: item.priceCents,
      quantity: item.quantity,
      freeShipping: item.freeShipping,
    })),
  );

  return {
    id: cart.id,
    items,
    ...totals,
  };
}
