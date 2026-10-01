import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MAX_CART_QUANTITY, type AddCartItemDto } from '../dto/cart-item.dto.js';
import type { CartResponseDto } from '../dto/cart-response.dto.js';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart.repository.js';
import { GetCartUseCase } from './get-cart.use-case.js';

@Injectable()
export class AddCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly carts: CartRepository,
    private readonly getCart: GetCartUseCase,
  ) {}

  async execute(input: AddCartItemDto): Promise<CartResponseDto> {
    const product = await this.carts.findProduct(input.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.inStock) {
      throw new ConflictException('Product is out of stock');
    }

    const cart = await this.carts.findActiveCart();
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    const existing = cart.items.find((item) => item.product.id === product.id);
    if (existing) {
      const nextQuantity = existing.quantity + input.quantity;
      if (nextQuantity > MAX_CART_QUANTITY) {
        throw new BadRequestException(`Quantity cannot exceed ${MAX_CART_QUANTITY}`);
      }

      await this.carts.updateLineQuantity(existing.id, nextQuantity);
    } else {
      await this.carts.insertLine(cart.id, product.id, input.quantity);
    }

    return this.getCart.execute();
  }
}
