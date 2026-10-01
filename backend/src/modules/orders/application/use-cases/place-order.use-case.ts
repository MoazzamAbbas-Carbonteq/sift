import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { calculateOrderTotals } from '../../../../common/order-totals.js';
import type { CheckoutCart, OrderDraft } from '../../domain/order.js';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';
import type { PlaceOrderDto } from '../dto/place-order.dto.js';
import type { OrderResponseDto } from '../dto/order-response.dto.js';
import { toOrderResponse } from '../order-response.js';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  async execute(input: PlaceOrderDto): Promise<OrderResponseDto> {
    const order = await this.orders.place((cart) => this.buildDraft(cart, input));
    return toOrderResponse(order);
  }

  private buildDraft(cart: CheckoutCart, input: PlaceOrderDto): OrderDraft {
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const unavailable = cart.items.find((item) => !item.product.inStock);
    if (unavailable) {
      throw new ConflictException(`${unavailable.product.name} is out of stock`);
    }

    const totals = calculateOrderTotals(
      cart.items.map((item) => ({
        priceCents: item.product.priceCents,
        quantity: item.quantity,
        freeShipping: item.product.freeShipping,
      })),
    );

    return {
      shippingName: input.shippingName,
      shippingAddress: input.shippingAddress,
      ...totals,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unitPriceCents: item.product.priceCents,
        quantity: item.quantity,
        lineTotalCents: item.product.priceCents * item.quantity,
      })),
    };
  }
}
