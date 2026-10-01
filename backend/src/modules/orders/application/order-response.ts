import type { OrderRecord } from '../domain/order.js';
import type { OrderResponseDto } from './dto/order-response.dto.js';

export function toOrderResponse(order: OrderRecord): OrderResponseDto {
  return {
    id: order.id,
    status: order.status,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    shippingName: order.shippingName,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
      lineTotalCents: item.lineTotalCents,
    })),
  };
}
