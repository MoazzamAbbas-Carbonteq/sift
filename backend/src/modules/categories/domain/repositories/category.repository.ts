import type { CategoryRecord } from '../../../products/domain/product-search.js';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepository {
  list(): Promise<CategoryRecord[]>;
}
