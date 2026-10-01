import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CartResponseDto } from '../dto/cart-response.dto.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart.repository.js';
import { GetCartUseCase } from './get-cart.use-case.js';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly carts: CartRepository,
    private readonly getCart: GetCartUseCase,
  ) {}

  async execute(lineId: string): Promise<CartResponseDto> {
    const cart = await this.carts.findActiveCart();
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    const line = cart.items.find((item) => item.id === lineId);
    if (!line) {
      throw new NotFoundException('Cart item not found');
    }

    await this.carts.deleteLine(lineId);
    return this.getCart.execute();
  }
}
