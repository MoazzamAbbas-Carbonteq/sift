import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository.js';
import type { OrderResponseDto } from '../dto/order-response.dto.js';
import { toOrderResponse } from '../order-response.js';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  async execute(): Promise<OrderResponseDto[]> {
    const orders = await this.orders.listForDemoUser();
    return orders.map((order) => toOrderResponse(order));
  }
}
