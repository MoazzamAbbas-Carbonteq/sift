import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { toCartResponse } from '../cart-response.js';
import type { CartResponseDto } from '../dto/cart-response.dto.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart.repository.js';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly carts: CartRepository,
  ) {}

  async execute(): Promise<CartResponseDto> {
    const cart = await this.carts.findActiveCart();
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    return toCartResponse(cart);
  }
}
