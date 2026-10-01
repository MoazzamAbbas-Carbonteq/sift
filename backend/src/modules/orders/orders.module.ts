import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './infrastructure/persistence/order-item.entity.js';
import { Order } from './infrastructure/persistence/order.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
})
export class OrdersModule {}
