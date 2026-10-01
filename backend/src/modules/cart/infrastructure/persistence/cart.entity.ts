import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user.entity.js';
import type { CartItem } from './cart-item.entity.js';

@Entity('carts')
@Index('UQ_carts_one_active_per_user', ['user'], {
  unique: true,
  where: `"status" = 'active'`,
})
@Check('CHK_carts_status', `"status" IN ('active', 'checked_out')`)
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 32 })
  status: 'active' | 'checked_out';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany('CartItem', 'cart')
  items: CartItem[];
}
