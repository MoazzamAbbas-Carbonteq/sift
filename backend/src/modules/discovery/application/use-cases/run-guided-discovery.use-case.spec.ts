import { RunGuidedDiscoveryUseCase } from './run-guided-discovery.use-case.js';
import type { ProductRecord } from '../../../products/domain/product-search.js';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository.js';

const jbl: ProductRecord = {
  id: 'jbl-tune-510bt',
  name: 'JBL Tune 510BT',
  slug: 'jbl-tune-510bt',
  brand: 'JBL',
  description: 'A lightweight on-ear headphone.',
  priceCents: 4995,
  rating: 4.2,
  reviewCount: 15680,
  inStock: true,
  freeShipping: true,
  returnDays: 30,
  imageUrl: 'https://picsum.photos/seed/sift-jbl-tune-510bt/800/800',
  category: {
    id: 'headphones',
    name: 'Headphones',
    slug: 'headphones',
  },
  features: [{ label: 'Under $50', sortOrder: 0 }],
  attributes: [
    {
      key: 'use_case',
      stringValue: 'work',
      numberValue: null,
      booleanValue: null,
    },
    {
      key: 'noise_cancellation',
      stringValue: null,
      numberValue: null,
      booleanValue: false,
    },
  ],
  reviewSummary: null,
};

describe('RunGuidedDiscoveryUseCase', () => {
  it('loads headphones and returns a summary with a price reason', async () => {
    const findByCategorySlug = vi.fn<ProductRepository['findByCategorySlug']>().mockResolvedValue([
      jbl,
    ]);
    const repository: ProductRepository = {
      search: vi.fn(),
      findById: vi.fn(),
      findByCategorySlug,
    };
    const useCase = new RunGuidedDiscoveryUseCase(repository);

    const result = await useCase.execute({
      useCase: 'work',
      priority: 'lower_price',
      budget: 'under_100',
    });

    expect(findByCategorySlug).toHaveBeenCalledWith('headphones');
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.product).toMatchObject({
      id: jbl.id,
      priceCents: 4995,
      features: jbl.features,
    });
    expect(result.matches[0]?.product).not.toHaveProperty('description');
    expect(result.matches[0]?.reason).toBe(
      'Listed for work. Price is $49.95, among the lower prices in the under $100 range.',
    );
  });
});
