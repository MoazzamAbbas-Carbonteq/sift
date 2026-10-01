import { Inject, Injectable } from '@nestjs/common';
import { ProductSummaryDto } from '../../../products/application/dto/product-response.dto.js';
import type { ProductRecord } from '../../../products/domain/product-search.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../../products/domain/repositories/product.repository.js';
import { matchHeadphones } from '../../domain/match-headphones.js';
import type { MatchDiscoveryDto } from '../dto/match-discovery.dto.js';
import type { DiscoveryResponseDto } from '../dto/discovery-response.dto.js';

const HEADPHONES = 'headphones';

@Injectable()
export class RunGuidedDiscoveryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(input: MatchDiscoveryDto): Promise<DiscoveryResponseDto> {
    const products = await this.products.findByCategorySlug(HEADPHONES);
    const matches = matchHeadphones(products, {
      priority: input.priority,
      budget: input.budget,
    });

    return {
      matches: matches.map((match) => ({
        product: toSummary(match.product),
        reason: match.reason,
      })),
    };
  }
}

function toSummary(product: ProductRecord): ProductSummaryDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    priceCents: product.priceCents,
    rating: product.rating,
    reviewCount: product.reviewCount,
    inStock: product.inStock,
    freeShipping: product.freeShipping,
    returnDays: product.returnDays,
    imageUrl: product.imageUrl,
    category: product.category,
    features: product.features,
  };
}
