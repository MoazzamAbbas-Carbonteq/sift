import { matchHeadphones } from './match-headphones.js';
import type { ProductRecord } from '../../products/domain/product-search.js';

const headphones = [
  headphone({
    slug: 'sennheiser-momentum-4',
    name: 'Sennheiser Momentum 4 Wireless',
    priceCents: 34995,
    rating: 4.4,
    reviewCount: 4102,
    noiseCancellation: true,
    batteryHours: 60,
  }),
  headphone({
    slug: 'sony-inzone-h9',
    name: 'Sony INZONE H9',
    priceCents: 29800,
    rating: 4.1,
    reviewCount: 1876,
    noiseCancellation: true,
    batteryHours: 32,
  }),
  headphone({
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    priceCents: 39999,
    rating: 4.6,
    reviewCount: 18420,
    noiseCancellation: true,
    batteryHours: 30,
  }),
  headphone({
    slug: 'bose-quietcomfort-ultra',
    name: 'Bose QuietComfort Ultra Headphones',
    priceCents: 42900,
    rating: 4.5,
    reviewCount: 9320,
    noiseCancellation: true,
    batteryHours: 24,
  }),
  headphone({
    slug: 'apple-airpods-pro-2',
    name: 'Apple AirPods Pro 2',
    priceCents: 24900,
    rating: 4.7,
    reviewCount: 42110,
    noiseCancellation: true,
    batteryHours: 6,
  }),
  headphone({
    slug: 'anker-soundcore-space-q45',
    name: 'Anker Soundcore Space Q45',
    priceCents: 14999,
    rating: 4.3,
    reviewCount: 22140,
    noiseCancellation: true,
    batteryHours: 50,
  }),
  headphone({
    slug: 'jbl-tune-510bt',
    name: 'JBL Tune 510BT',
    priceCents: 4995,
    rating: 4.2,
    reviewCount: 15680,
    noiseCancellation: false,
    batteryHours: 40,
  }),
];

describe('matchHeadphones', () => {
  it('returns the longest-battery headphones inside $200+ and drops a short-battery match', () => {
    const matches = matchHeadphones(headphones, {
      priority: 'battery',
      budget: '200_plus',
    });

    expect(matches.map((match) => match.product.name)).toEqual([
      'Sennheiser Momentum 4 Wireless',
      'Sony INZONE H9',
      'Sony WH-1000XM5',
      'Bose QuietComfort Ultra Headphones',
    ]);
    expect(matches.map((match) => match.product.slug)).not.toContain('apple-airpods-pro-2');
    expect(matches[0]?.reason).toBe(
      '60-hour battery. Price is $349.95, inside the $200+ budget.',
    );
  });

  it('returns no matches when noise cancellation excludes the only under-$100 headphone', () => {
    const matches = matchHeadphones(headphones, {
      priority: 'noise_cancellation',
      budget: 'under_100',
    });

    expect(matches).toEqual([]);
  });
});

function headphone(input: {
  slug: string;
  name: string;
  priceCents: number;
  rating: number;
  reviewCount: number;
  noiseCancellation: boolean;
  batteryHours: number;
}): ProductRecord {
  return {
    id: input.slug,
    name: input.name,
    slug: input.slug,
    brand: input.name.split(' ')[0] ?? 'Brand',
    description: input.name,
    priceCents: input.priceCents,
    rating: input.rating,
    reviewCount: input.reviewCount,
    inStock: true,
    freeShipping: true,
    returnDays: 30,
    imageUrl: `https://picsum.photos/seed/sift-${input.slug}/800/800`,
    category: {
      id: 'headphones',
      name: 'Headphones',
      slug: 'headphones',
    },
    features: [],
    attributes: [
      {
        key: 'noise_cancellation',
        stringValue: null,
        numberValue: null,
        booleanValue: input.noiseCancellation,
      },
      {
        key: 'battery_hours',
        stringValue: null,
        numberValue: input.batteryHours,
        booleanValue: null,
      },
    ],
    reviewSummary: null,
  };
}
