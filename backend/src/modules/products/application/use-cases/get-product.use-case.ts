import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDetailDto } from '../dto/product-response.dto.js';
import type { ProductRecord } from '../../domain/product-search.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product.repository.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(id: string): Promise<ProductDetailDto> {
    const product = await this.products.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return toDetail(product);
  }
}

function toDetail(product: ProductRecord): ProductDetailDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    description: product.description,
    priceCents: product.priceCents,
    rating: product.rating,
    reviewCount: product.reviewCount,
    inStock: product.inStock,
    freeShipping: product.freeShipping,
    returnDays: product.returnDays,
    imageUrl: product.imageUrl,
    category: product.category,
    features: product.features,
    attributes: product.attributes,
    reviewSummary: product.reviewSummary,
  };
}
