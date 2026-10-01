import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateCartItemDto } from '../dto/cart-item.dto.js';
import type { CartResponseDto } from '../dto/cart-response.dto.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart.repository.js';
import { GetCartUseCase } from './get-cart.use-case.js';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly carts: CartRepository,
    private readonly getCart: GetCartUseCase,
  ) {}

  async execute(lineId: string, input: UpdateCartItemDto): Promise<CartResponseDto> {
    const cart = await this.carts.findActiveCart();
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    const line = cart.items.find((item) => item.id === lineId);
    if (!line) {
      throw new NotFoundException('Cart item not found');
    }

    if (!line.product.inStock) {
      throw new ConflictException('Product is out of stock');
    }

    await this.carts.updateLineQuantity(lineId, input.quantity);
    return this.getCart.execute();
  }
}
