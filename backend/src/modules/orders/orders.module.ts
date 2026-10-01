import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../cart/infrastructure/persistence/user.entity.js';
import { CartItem } from '../cart/infrastructure/persistence/cart-item.entity.js';
import { Cart } from '../cart/infrastructure/persistence/cart.entity.js';
import { Product } from '../products/infrastructure/persistence/product.entity.js';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case.js';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case.js';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case.js';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.js';
import { OrderItem } from './infrastructure/persistence/order-item.entity.js';
import { Order } from './infrastructure/persistence/order.entity.js';
import { TypeOrmOrderRepository } from './infrastructure/repositories/typeorm-order.repository.js';
import { OrdersController } from './presentation/orders.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Cart, CartItem, Product])],
  controllers: [OrdersController],
  providers: [
    PlaceOrderUseCase,
    ListOrdersUseCase,
    GetOrderUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: TypeOrmOrderRepository,
    },
  ],
})
export class OrdersModule {}
