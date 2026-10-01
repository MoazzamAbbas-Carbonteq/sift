import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';
import type { OrderResponseDto } from '../dto/order-response.dto.js';
import { toOrderResponse } from '../order-response.js';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  async execute(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orders.findForDemoUser(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return toOrderResponse(order);
  }
}
