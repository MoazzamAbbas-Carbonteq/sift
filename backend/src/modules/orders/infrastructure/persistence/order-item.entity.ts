import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Product } from '../../../products/infrastructure/persistence/product.entity.js';
import type { Order } from './order.entity.js';

@Entity('order_items')
@Check(
  'CHK_order_items_snapshot',
  '"unit_price_cents" >= 0 AND "quantity" > 0 AND "line_total_cents" >= 0',
)
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Order', 'items', { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne('Product', { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'integer' })
  unitPriceCents: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer' })
  lineTotalCents: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
