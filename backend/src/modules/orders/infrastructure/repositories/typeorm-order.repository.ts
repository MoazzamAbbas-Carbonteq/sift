import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, type Repository } from 'typeorm';
import { DEMO_USER_EMAIL } from '../../../../common/demo-user.js';
import { User } from '../../../cart/infrastructure/persistence/user.entity.js';
import { CartItem } from '../../../cart/infrastructure/persistence/cart-item.entity.js';
import { Cart } from '../../../cart/infrastructure/persistence/cart.entity.js';
import { Product } from '../../../products/infrastructure/persistence/product.entity.js';
import type { CheckoutCart, OrderDraft, OrderRecord } from '../../domain/order.js';
import type { OrderRepository } from '../../domain/repositories/order.repository.js';
import { OrderItem } from '../persistence/order-item.entity.js';
import { Order } from '../persistence/order.entity.js';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async place(
    build: (cart: CheckoutCart) => Promise<OrderDraft> | OrderDraft,
  ): Promise<OrderRecord> {
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const carts = manager.getRepository(Cart);
      const cartItems = manager.getRepository(CartItem);
      const orders = manager.getRepository(Order);
      const orderItems = manager.getRepository(OrderItem);

      const user = await users.findOne({ where: { email: DEMO_USER_EMAIL } });
      if (!user) {
        throw new NotFoundException('Demo user not found');
      }

      const cart = await carts
        .createQueryBuilder('cart')
        .where('cart.user_id = :userId', { userId: user.id })
        .andWhere('cart.status = :status', { status: 'active' })
        .setLock('pessimistic_write')
        .getOne();

      if (!cart) {
        throw new NotFoundException('Active cart not found');
      }

      const lines = await cartItems.find({
        where: { cart: { id: cart.id } },
        relations: { product: true },
        order: { createdAt: 'ASC' },
      });

      const draft = await build({
        id: cart.id,
        items: lines.map((line) => ({
          quantity: line.quantity,
          product: {
            id: line.product.id,
            name: line.product.name,
            priceCents: line.product.priceCents,
            freeShipping: line.product.freeShipping,
            inStock: line.product.inStock,
          },
        })),
      });

      const order = await orders.save(
        orders.create({
          id: randomUUID(),
          user,
          status: 'placed',
          subtotalCents: draft.subtotalCents,
          shippingCents: draft.shippingCents,
          taxCents: draft.taxCents,
          totalCents: draft.totalCents,
          shippingName: draft.shippingName,
          shippingAddress: draft.shippingAddress,
        }),
      );

      await orderItems.save(
        draft.items.map((item) =>
          orderItems.create({
            id: randomUUID(),
            order,
            product: { id: item.productId } as Product,
            productName: item.productName,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
            lineTotalCents: item.lineTotalCents,
          }),
        ),
      );

      cart.status = 'checked_out';
      await carts.save(cart);
      await carts.save(
        carts.create({
          id: randomUUID(),
          user,
          status: 'active',
        }),
      );

      const placed = await orders.findOne({
        where: { id: order.id },
        relations: { items: { product: true } },
      });
      if (!placed) {
        throw new NotFoundException('Order not found');
      }

      return toOrderRecord(placed);
    });
  }

  async listForDemoUser(): Promise<OrderRecord[]> {
    const orders = this.dataSource.getRepository(Order);
    const user = await this.findDemoUser(this.dataSource.getRepository(User));
    const rows = await orders.find({
      where: { user: { id: user.id } },
      relations: { items: { product: true } },
      order: { createdAt: 'DESC' },
    });

    return rows.map((order) => toOrderRecord(order));
  }

  async findForDemoUser(orderId: string): Promise<OrderRecord | null> {
    const orders = this.dataSource.getRepository(Order);
    const user = await this.findDemoUser(this.dataSource.getRepository(User));
    const order = await orders.findOne({
      where: { id: orderId, user: { id: user.id } },
      relations: { items: { product: true } },
    });

    return order ? toOrderRecord(order) : null;
  }

  private async findDemoUser(users: Repository<User>): Promise<User> {
    const user = await users.findOne({ where: { email: DEMO_USER_EMAIL } });
    if (!user) {
      throw new NotFoundException('Demo user not found');
    }

    return user;
  }
}

function toOrderRecord(order: Order): OrderRecord {
  const items = [...(order.items ?? [])].sort(
    (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
  );

  return {
    id: order.id,
    status: order.status,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    shippingName: order.shippingName,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.productName,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
      lineTotalCents: item.lineTotalCents,
    })),
  };
}
