import { ApiProperty } from '@nestjs/swagger';

export class CategorySummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Headphones' })
  name: string;

  @ApiProperty({ example: 'headphones' })
  slug: string;
}

export class ProductFeatureDto {
  @ApiProperty({ example: '30-hour battery' })
  label: string;

  @ApiProperty({ example: 0 })
  sortOrder: number;
}

export class ProductAttributeDto {
  @ApiProperty({ example: 'noise_cancellation' })
  key: string;

  @ApiProperty({ example: 'travel', nullable: true })
  stringValue: string | null;

  @ApiProperty({ example: 30, nullable: true })
  numberValue: number | null;

  @ApiProperty({ example: true, nullable: true })
  booleanValue: boolean | null;
}

export class ReviewThemeDto {
  @ApiProperty({ example: 'Sound quality' })
  label: string;

  @ApiProperty({ example: 84 })
  percentage: number;
}

export class ProductReviewSummaryDto {
  @ApiProperty({ type: [ReviewThemeDto] })
  positiveThemes: ReviewThemeDto[];

  @ApiProperty({ type: [ReviewThemeDto] })
  negativeThemes: ReviewThemeDto[];
}

export class ProductSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Sony WH-1000XM5' })
  name: string;

  @ApiProperty({ example: 'sony-wh-1000xm5' })
  slug: string;

  @ApiProperty({ example: 'Sony' })
  brand: string;

  @ApiProperty({ example: 39999, description: 'Price in integer cents' })
  priceCents: number;

  @ApiProperty({ example: 4.6 })
  rating: number;

  @ApiProperty({ example: 18420 })
  reviewCount: number;

  @ApiProperty({ example: true })
  inStock: boolean;

  @ApiProperty({ example: true })
  freeShipping: boolean;

  @ApiProperty({ example: 30 })
  returnDays: number;

  @ApiProperty({ example: 'https://picsum.photos/seed/sift-sony-wh-1000xm5/800/800' })
  imageUrl: string;

  @ApiProperty({ type: CategorySummaryDto })
  category: CategorySummaryDto;

  @ApiProperty({ type: [ProductFeatureDto] })
  features: ProductFeatureDto[];
}

export class ProductDetailDto extends ProductSummaryDto {
  @ApiProperty({
    example:
      'Over-ear wireless headphones with adaptive noise cancellation for long flights and open offices.',
  })
  description: string;

  @ApiProperty({ type: [ProductAttributeDto] })
  attributes: ProductAttributeDto[];

  @ApiProperty({ type: ProductReviewSummaryDto, nullable: true })
  reviewSummary: ProductReviewSummaryDto | null;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductSummaryDto] })
  items: ProductSummaryDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 30 })
  total: number;
}
