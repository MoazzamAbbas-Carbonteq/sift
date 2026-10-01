import { apiFetch } from "./client";

export const PRODUCT_SORTS = [
  "price_asc",
  "price_desc",
  "rating_asc",
  "rating_desc",
  "reviews_desc",
  "newest",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductFeature = {
  label: string;
  sortOrder: number;
};

export type ReviewTheme = {
  label: string;
  percentage: number;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  priceCents: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  freeShipping: boolean;
  returnDays: number;
  imageUrl: string;
  category: Category;
  features: ProductFeature[];
};

export type ProductDetail = ProductSummary & {
  description: string;
  attributes: {
    key: string;
    stringValue: string | null;
    numberValue: number | null;
    booleanValue: boolean | null;
  }[];
  reviewSummary: {
    positiveThemes: ReviewTheme[];
    negativeThemes: ReviewTheme[];
  } | null;
};

export type PaginatedProducts = {
  items: ProductSummary[];
  page: number;
  limit: number;
  total: number;
};

export type ProductQuery = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  freeShipping?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  attribute?: string[];
};

export type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export const featuredProductQuery: ProductQuery = {
  sort: "rating_desc",
  limit: 8,
};

export const productKeys = {
  all: ["products"] as const,
  list: (query: ProductQuery) => ["products", "list", query] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export function parseProductQuery(source: SearchParamSource): ProductQuery {
  return normalizeProductQuery({
    q: readOne(source, "q"),
    category: readOne(source, "category"),
    minPrice: readInt(readOne(source, "minPrice")),
    maxPrice: readInt(readOne(source, "maxPrice")),
    minRating: readRating(readOne(source, "minRating")),
    inStock: readBoolean(readOne(source, "inStock")),
    freeShipping: readBoolean(readOne(source, "freeShipping")),
    sort: readSort(readOne(source, "sort")),
    page: readPage(readOne(source, "page")),
    limit: readLimit(readOne(source, "limit")),
    attribute: readAll(source, "attribute"),
  });
}

export function normalizeProductQuery(query: ProductQuery): ProductQuery {
  const next: ProductQuery = {};
  const q = query.q?.trim();
  if (q) {
    next.q = q.slice(0, 200);
  }

  const category = query.category?.trim();
  if (category) {
    next.category = category;
  }

  if (isNonNegativeInt(query.minPrice)) {
    next.minPrice = query.minPrice;
  }

  if (isNonNegativeInt(query.maxPrice)) {
    next.maxPrice = query.maxPrice;
  }

  if (
    query.minRating !== undefined &&
    query.minRating >= 0 &&
    query.minRating <= 5
  ) {
    next.minRating = query.minRating;
  }

  if (query.inStock !== undefined) {
    next.inStock = query.inStock;
  }

  if (query.freeShipping !== undefined) {
    next.freeShipping = query.freeShipping;
  }

  if (query.sort && isProductSort(query.sort)) {
    next.sort = query.sort;
  }

  if (query.page !== undefined && query.page >= 1) {
    next.page = query.page;
  }

  if (query.limit !== undefined && query.limit >= 1 && query.limit <= 48) {
    next.limit = query.limit;
  }

  const attributes = [
    ...new Set((query.attribute ?? []).filter(isAttributeFilter)),
  ].sort();
  if (attributes.length > 0) {
    next.attribute = attributes;
  }

  return next;
}

export function toProductSearchParams(query: ProductQuery): URLSearchParams {
  const normalized = normalizeProductQuery(query);
  const params = new URLSearchParams();

  if (normalized.q) params.set("q", normalized.q);
  if (normalized.category) params.set("category", normalized.category);
  if (normalized.minPrice !== undefined) {
    params.set("minPrice", String(normalized.minPrice));
  }
  if (normalized.maxPrice !== undefined) {
    params.set("maxPrice", String(normalized.maxPrice));
  }
  if (normalized.minRating !== undefined) {
    params.set("minRating", String(normalized.minRating));
  }
  if (normalized.inStock !== undefined) {
    params.set("inStock", String(normalized.inStock));
  }
  if (normalized.freeShipping !== undefined) {
    params.set("freeShipping", String(normalized.freeShipping));
  }
  if (normalized.sort) params.set("sort", normalized.sort);
  if (normalized.page !== undefined) params.set("page", String(normalized.page));
  if (normalized.limit !== undefined) {
    params.set("limit", String(normalized.limit));
  }
  for (const attribute of normalized.attribute ?? []) {
    params.append("attribute", attribute);
  }

  return params;
}

export function productSearchHref(query: ProductQuery): string {
  const search = toProductSearchParams(query).toString();
  return search ? `/search?${search}` : "/search";
}

export function fetchProducts(query: ProductQuery): Promise<PaginatedProducts> {
  const search = toProductSearchParams(query).toString();
  return apiFetch<PaginatedProducts>(`/products${search ? `?${search}` : ""}`);
}

export function fetchProduct(id: string): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(`/products/${id}`);
}

function readOne(source: SearchParamSource, key: string): string | undefined {
  const value =
    source instanceof URLSearchParams ? source.get(key) : source[key];
  const first = Array.isArray(value) ? value[0] : value;
  if (!first) {
    return undefined;
  }

  return first;
}

function readAll(source: SearchParamSource, key: string): string[] {
  if (source instanceof URLSearchParams) {
    return source.getAll(key).filter((value) => value.length > 0);
  }

  const value = source[key];
  if (Array.isArray(value)) {
    return value.filter((item) => item.length > 0);
  }

  return value ? [value] : [];
}

function readInt(value: string | undefined): number | undefined {
  if (value === undefined || !/^\d+$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

function readRating(value: string | undefined): number | undefined {
  if (value === undefined || !/^\d(\.\d)?$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

function readBoolean(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function readSort(value: string | undefined): ProductSort | undefined {
  return value && isProductSort(value) ? value : undefined;
}

function readPage(value: string | undefined): number | undefined {
  const page = readInt(value);
  return page !== undefined && page >= 1 ? page : undefined;
}

function readLimit(value: string | undefined): number | undefined {
  const limit = readInt(value);
  return limit !== undefined && limit >= 1 && limit <= 48 ? limit : undefined;
}

function isProductSort(value: string): value is ProductSort {
  return PRODUCT_SORTS.some((sort) => sort === value);
}

function isAttributeFilter(value: string): boolean {
  const separator = value.indexOf(":");
  if (separator <= 0) {
    return false;
  }

  const key = value.slice(0, separator);
  const raw = value.slice(separator + 1);
  return /^[a-z][a-z0-9_]*$/.test(key) && raw.length > 0 && raw.length <= 80;
}

function isNonNegativeInt(value: number | undefined): value is number {
  return value !== undefined && Number.isInteger(value) && value >= 0;
}
