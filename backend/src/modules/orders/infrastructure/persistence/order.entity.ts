import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../../cart/infrastructure/persistence/user.entity.js';
import type { OrderItem } from './order-item.entity.js';

@Entity('orders')
@Check(
  'CHK_orders_money',
  '"subtotal_cents" >= 0 AND "shipping_cents" >= 0 AND "tax_cents" >= 0 AND "total_cents" >= 0',
)
@Check('CHK_orders_status', `"status" = 'placed'`)
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 32 })
  status: 'placed';

  @Column({ type: 'integer' })
  subtotalCents: number;

  @Column({ type: 'integer' })
  shippingCents: number;

  @Column({ type: 'integer' })
  taxCents: number;

  @Column({ type: 'integer' })
  totalCents: number;

  @Column({ type: 'varchar', length: 255 })
  shippingName: string;

  @Column({ type: 'text' })
  shippingAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany('OrderItem', 'order')
  items: OrderItem[];
}
