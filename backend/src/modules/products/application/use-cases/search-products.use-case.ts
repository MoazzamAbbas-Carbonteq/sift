import { Inject, Injectable } from '@nestjs/common';
import type { SearchProductsQueryDto } from '../dto/search-products.query.js';
import {
  PaginatedProductsDto,
  ProductSummaryDto,
} from '../dto/product-response.dto.js';
import type {
  ProductRecord,
  ProductSearchCriteria,
} from '../../domain/product-search.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../domain/repositories/product.repository.js';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(query: SearchProductsQueryDto): Promise<PaginatedProductsDto> {
    const criteria = toCriteria(query);
    const result = await this.products.search(criteria);

    return {
      items: result.items.map(toSummary),
      page: result.page,
      limit: result.limit,
      total: result.total,
    };
  }
}

export function toCriteria(query: SearchProductsQueryDto): ProductSearchCriteria {
  const q = query.q?.trim();
  const category = query.category?.trim();

  return {
    q: q ? q : undefined,
    categorySlug: category ? category : undefined,
    minPriceCents: query.minPrice,
    maxPriceCents: query.maxPrice,
    minRating: query.minRating,
    inStock: query.inStock,
    freeShipping: query.freeShipping,
    attributes: (query.attribute ?? []).map(parseAttribute),
    sort: query.sort ?? 'rating_desc',
    page: query.page ?? 1,
    limit: query.limit ?? 12,
  };
}

function parseAttribute(attribute: string): { key: string; value: string } {
  const separator = attribute.indexOf(':');
  return {
    key: attribute.slice(0, separator),
    value: attribute.slice(separator + 1),
  };
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
