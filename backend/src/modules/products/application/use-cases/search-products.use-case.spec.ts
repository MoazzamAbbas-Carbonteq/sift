import { SearchProductsUseCase } from './search-products.use-case.js';
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
  attributes: [],
  reviewSummary: null,
};

describe('SearchProductsUseCase', () => {
  it('passes normalized search criteria to the repository', async () => {
    const search = vi.fn<ProductRepository['search']>().mockResolvedValue({
      items: [product],
      page: 2,
      limit: 12,
      total: 1,
    });
    const repository: ProductRepository = {
      search,
      findById: vi.fn(),
    };
    const useCase = new SearchProductsUseCase(repository);

    const result = await useCase.execute({
      q: '  sony  ',
      category: ' headphones ',
      minPrice: 10000,
      sort: 'price_asc',
      page: 2,
      attribute: ['use_case:travel', 'noise_cancellation:true', 'use_case:work'],
    });

    expect(search).toHaveBeenCalledWith({
      q: 'sony',
      categorySlug: 'headphones',
      minPriceCents: 10000,
      maxPriceCents: undefined,
      minRating: undefined,
      inStock: undefined,
      freeShipping: undefined,
      attributes: [
        { key: 'use_case', value: 'travel' },
        { key: 'noise_cancellation', value: 'true' },
        { key: 'use_case', value: 'work' },
      ],
      sort: 'price_asc',
      page: 2,
      limit: 12,
    });
    expect(result.items[0]).toMatchObject({
      id: product.id,
      priceCents: 39999,
      features: product.features,
    });
    expect(result.items[0]).not.toHaveProperty('description');
    expect(result.total).toBe(1);
  });

  it('defaults sort, page, and limit', async () => {
    const search = vi.fn<ProductRepository['search']>().mockResolvedValue({
      items: [],
      page: 1,
      limit: 12,
      total: 0,
    });
    const repository: ProductRepository = {
      search,
      findById: vi.fn(),
    };
    const useCase = new SearchProductsUseCase(repository);

    await useCase.execute({});

    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: 'rating_desc',
        page: 1,
        limit: 12,
        attributes: [],
      }),
    );
  });
});
