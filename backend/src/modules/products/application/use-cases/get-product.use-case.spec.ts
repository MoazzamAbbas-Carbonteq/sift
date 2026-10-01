import { NotFoundException } from '@nestjs/common';
import { GetProductUseCase } from './get-product.use-case.js';
import type { ProductRecord } from '../../domain/product-search.js';
import type { ProductRepository } from '../../domain/repositories/product.repository.js';

const product: ProductRecord = {
  id: 'a1000001-0000-4000-8000-000000000001',
  name: 'Sony WH-1000XM5',
  slug: 'sony-wh-1000xm5',
  brand: 'Sony',
  description: 'Over-ear wireless headphones.',
  priceCents: 39999,
  rating: 4.6,
  reviewCount: 18420,
  inStock: true,
  freeShipping: true,
  returnDays: 30,
  imageUrl: 'https://picsum.photos/seed/sift-sony-wh-1000xm5/800/800',
  category: {
    id: 'c1000001-0000-4000-8000-000000000001',
    name: 'Headphones',
    slug: 'headphones',
  },
  features: [{ label: '30-hour battery', sortOrder: 0 }],
  attributes: [
    {
      key: 'noise_cancellation',
      stringValue: null,
      numberValue: null,
      booleanValue: true,
    },
  ],
  reviewSummary: {
    positiveThemes: [{ label: 'Sound quality', percentage: 84 }],
    negativeThemes: [{ label: 'Case is bulky', percentage: 18 }],
  },
};

describe('GetProductUseCase', () => {
  it('returns the product detail', async () => {
    const repository: ProductRepository = {
      search: vi.fn(),
      findById: vi.fn().mockResolvedValue(product),
      findByCategorySlug: vi.fn(),
    };
    const useCase = new GetProductUseCase(repository);

    await expect(useCase.execute(product.id)).resolves.toMatchObject({
      id: product.id,
      priceCents: 39999,
      description: product.description,
      attributes: product.attributes,
      reviewSummary: product.reviewSummary,
    });
  });

  it('rejects a missing product', async () => {
    const repository: ProductRepository = {
      search: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      findByCategorySlug: vi.fn(),
    };
    const useCase = new GetProductUseCase(repository);

    await expect(useCase.execute(product.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
