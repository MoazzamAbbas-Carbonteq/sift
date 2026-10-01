import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericColumnTransformer } from './numeric-column.js';
import type { Product } from './product.entity.js';

const ONE_VALUE_CHECK = `(
  (CASE WHEN "string_value" IS NOT NULL THEN 1 ELSE 0 END) +
  (CASE WHEN "number_value" IS NOT NULL THEN 1 ELSE 0 END) +
  (CASE WHEN "boolean_value" IS NOT NULL THEN 1 ELSE 0 END)
) = 1`;

@Entity('product_attributes')
@Index('IDX_product_attributes_product_id_attribute_key', [
  'product',
  'attributeKey',
])
@Check('CHK_product_attributes_one_value', ONE_VALUE_CHECK)
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Product', 'attributes', { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 64 })
  attributeKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stringValue: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: numericColumnTransformer,
  })
  numberValue: number | null;

  @Column({ type: 'boolean', nullable: true })
  booleanValue: boolean | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
