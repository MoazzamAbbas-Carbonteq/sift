import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Category } from '../../../categories/infrastructure/persistence/category.entity.js';
import { numericColumnTransformer } from './numeric-column.js';
import type { ProductAttribute } from './product-attribute.entity.js';
import type { ProductFeature } from './product-feature.entity.js';
import type { ProductReviewSummary } from './product-review-summary.entity.js';

@Entity('products')
@Index('IDX_products_category_id', ['category'])
@Index('IDX_products_price_cents', ['priceCents'])
@Index('IDX_products_rating', ['rating'])
@Index('IDX_products_name', ['name'])
@Check('CHK_products_price_cents', '"price_cents" >= 0')
@Check('CHK_products_rating', '"rating" >= 0 AND "rating" <= 5')
@Check('CHK_products_review_count', '"review_count" >= 0')
@Check('CHK_products_return_days', '"return_days" >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Category', { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  brand: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer' })
  priceCents: number;

  @Column({
    type: 'numeric',
    precision: 2,
    scale: 1,
    transformer: numericColumnTransformer,
  })
  rating: number;

  @Column({ type: 'integer' })
  reviewCount: number;

  @Column({ type: 'boolean' })
  inStock: boolean;

  @Column({ type: 'boolean' })
  freeShipping: boolean;

  @Column({ type: 'integer' })
  returnDays: number;

  @Column({ type: 'text' })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany('ProductAttribute', 'product')
  attributes: ProductAttribute[];

  @OneToMany('ProductFeature', 'product')
  features: ProductFeature[];

  @OneToOne('ProductReviewSummary', 'product')
  reviewSummary: ProductReviewSummary | null;
}
