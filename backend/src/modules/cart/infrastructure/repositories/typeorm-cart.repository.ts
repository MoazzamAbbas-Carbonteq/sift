import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';
import { DEMO_USER_EMAIL } from '../../../../common/demo-user.js';
import { Product } from '../../../products/infrastructure/persistence/product.entity.js';
import type { CartProductSnapshot, CartRecord } from '../../domain/cart.js';
import type { CartRepository } from '../../domain/repositories/cart.repository.js';
import { CartItem } from '../persistence/cart-item.entity.js';
import { Cart } from '../persistence/cart.entity.js';
import { User } from '../persistence/user.entity.js';

@Injectable()
export class TypeOrmCartRepository implements CartRepository {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Cart)
    private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly items: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async findActiveCart(): Promise<CartRecord | null> {
    const user = await this.findDemoUser();
    const cart = await this.carts.findOne({
      where: { user: { id: user.id }, status: 'active' },
      relations: { items: { product: true } },
    });

    if (!cart) {
      return null;
    }

    const items = [...(cart.items ?? [])].sort(
      (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
    );

    return {
      id: cart.id,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: toProductSnapshot(item.product),
      })),
    };
  }

  async findProduct(productId: string): Promise<CartProductSnapshot | null> {
    const product = await this.products.findOne({ where: { id: productId } });
    return product ? toProductSnapshot(product) : null;
  }

  async insertLine(cartId: string, productId: string, quantity: number): Promise<void> {
    await this.items.save(
      this.items.create({
        id: randomUUID(),
        cart: { id: cartId } as Cart,
        product: { id: productId } as Product,
        quantity,
      }),
    );
  }

  async updateLineQuantity(lineId: string, quantity: number): Promise<void> {
    await this.items.update({ id: lineId }, { quantity });
  }

  async deleteLine(lineId: string): Promise<void> {
    await this.items.delete({ id: lineId });
  }

  private async findDemoUser(): Promise<User> {
    const user = await this.users.findOne({ where: { email: DEMO_USER_EMAIL } });
    if (!user) {
      throw new NotFoundException('Demo user not found');
    }

    return user;
  }
}

function toProductSnapshot(product: Product): CartProductSnapshot {
  return {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    priceCents: product.priceCents,
    freeShipping: product.freeShipping,
    inStock: product.inStock,
  };
}
