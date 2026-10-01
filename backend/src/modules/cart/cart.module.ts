import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './infrastructure/persistence/cart-item.entity.js';
import { Cart } from './infrastructure/persistence/cart.entity.js';
import { User } from './infrastructure/persistence/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem])],
})
export class CartModule {}
