import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Product } from './product.entity.js';
import type { ReviewTheme } from './review-theme.js';

@Entity('product_reviews_summary')
export class ProductReviewSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne('Product', 'reviewSummary', {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'jsonb' })
  positiveThemes: ReviewTheme[];

  @Column({ type: 'jsonb' })
  negativeThemes: ReviewTheme[];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
