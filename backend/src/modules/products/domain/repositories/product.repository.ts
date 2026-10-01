import type {
  Paginated,
  ProductRecord,
  ProductSearchCriteria,
} from '../product-search.js';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  search(criteria: ProductSearchCriteria): Promise<Paginated<ProductRecord>>;
  findById(id: string): Promise<ProductRecord | null>;
}
