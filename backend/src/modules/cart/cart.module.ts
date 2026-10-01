import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/infrastructure/persistence/product.entity.js';
import { AddCartItemUseCase } from './application/use-cases/add-cart-item.use-case.js';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case.js';
import { UpdateCartItemUseCase } from './application/use-cases/update-cart-item.use-case.js';
import { CART_REPOSITORY } from './domain/repositories/cart.repository.js';
import { CartItem } from './infrastructure/persistence/cart-item.entity.js';
import { Cart } from './infrastructure/persistence/cart.entity.js';
import { User } from './infrastructure/persistence/user.entity.js';
import { TypeOrmCartRepository } from './infrastructure/repositories/typeorm-cart.repository.js';
import { CartController } from './presentation/cart.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Product])],
  controllers: [CartController],
  providers: [
    GetCartUseCase,
    AddCartItemUseCase,
    UpdateCartItemUseCase,
    RemoveCartItemUseCase,
    {
      provide: CART_REPOSITORY,
      useClass: TypeOrmCartRepository,
    },
  ],
})
export class CartModule {}
