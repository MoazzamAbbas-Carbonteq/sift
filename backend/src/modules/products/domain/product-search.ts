export const PRODUCT_SORTS = [
  'price_asc',
  'price_desc',
  'rating_asc',
  'rating_desc',
  'reviews_desc',
  'newest',
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export type AttributeFilter = {
  key: string;
  value: string;
};

export type ProductSearchCriteria = {
  q?: string;
  categorySlug?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  minRating?: number;
  inStock?: boolean;
  freeShipping?: boolean;
  attributes: AttributeFilter[];
  sort: ProductSort;
  page: number;
  limit: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
};

export type ReviewThemeRecord = {
  label: string;
  percentage: number;
};

export type ProductAttributeRecord = {
  key: string;
  stringValue: string | null;
  numberValue: number | null;
  booleanValue: boolean | null;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  priceCents: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  freeShipping: boolean;
  returnDays: number;
  imageUrl: string;
  category: CategoryRecord;
  features: { label: string; sortOrder: number }[];
  attributes: ProductAttributeRecord[];
  reviewSummary: {
    positiveThemes: ReviewThemeRecord[];
    negativeThemes: ReviewThemeRecord[];
  } | null;
};
