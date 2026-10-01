import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, type Repository, type SelectQueryBuilder } from 'typeorm';
import type {
  Paginated,
  ProductRecord,
  ProductSearchCriteria,
  ProductSort,
} from '../../domain/product-search.js';
import type { ProductRepository } from '../../domain/repositories/product.repository.js';
import { Product } from '../persistence/product.entity.js';
import { toProductRecord } from './product.mapper.js';

const SORT_COLUMNS: Record<ProductSort, { column: string; direction: 'ASC' | 'DESC' }> = {
  price_asc: { column: 'product.priceCents', direction: 'ASC' },
  price_desc: { column: 'product.priceCents', direction: 'DESC' },
  rating_asc: { column: 'product.rating', direction: 'ASC' },
  rating_desc: { column: 'product.rating', direction: 'DESC' },
  reviews_desc: { column: 'product.reviewCount', direction: 'DESC' },
  newest: { column: 'product.createdAt', direction: 'DESC' },
};

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async search(criteria: ProductSearchCriteria): Promise<Paginated<ProductRecord>> {
    const total = await this.filteredQuery(criteria).getCount();
    const pageRows = await this.filteredQuery(criteria)
      .orderBy(SORT_COLUMNS[criteria.sort].column, SORT_COLUMNS[criteria.sort].direction)
      .addOrderBy('product.id', 'ASC')
      .offset((criteria.page - 1) * criteria.limit)
      .limit(criteria.limit)
      .getMany();

    if (pageRows.length === 0) {
      return { items: [], page: criteria.page, limit: criteria.limit, total };
    }

    const ids = pageRows.map((row) => row.id);
    const loaded = await this.products.find({
      where: { id: In(ids) },
      relations: { category: true, features: true },
    });
    const byId = new Map(loaded.map((product) => [product.id, product]));
    const items = ids.flatMap((id) => {
      const product = byId.get(id);
      return product ? [toProductRecord(product)] : [];
    });

    return { items, page: criteria.page, limit: criteria.limit, total };
  }

  async findById(id: string): Promise<ProductRecord | null> {
    const product = await this.products.findOne({
      where: { id },
      relations: {
        category: true,
        features: true,
        attributes: true,
        reviewSummary: true,
      },
    });

    return product ? toProductRecord(product) : null;
  }

  async findByCategorySlug(slug: string): Promise<ProductRecord[]> {
    const products = await this.products.find({
      where: { category: { slug } },
      relations: { category: true, features: true, attributes: true },
      order: { id: 'ASC' },
    });

    return products.map(toProductRecord);
  }

  private filteredQuery(criteria: ProductSearchCriteria): SelectQueryBuilder<Product> {
    const query = this.products
      .createQueryBuilder('product')
      .innerJoin('product.category', 'category');

    if (criteria.q) {
      const term = `%${escapeLike(criteria.q)}%`;
      query.andWhere(
        new Brackets((subquery) => {
          subquery
            .where(`product.name ILIKE :term ESCAPE '\\'`, { term })
            .orWhere(`product.brand ILIKE :term ESCAPE '\\'`, { term })
            .orWhere(`product.description ILIKE :term ESCAPE '\\'`, { term });
        }),
      );
    }

    if (criteria.categorySlug) {
      query.andWhere('category.slug = :categorySlug', {
        categorySlug: criteria.categorySlug,
      });
    }

    if (criteria.minPriceCents !== undefined) {
      query.andWhere('product.priceCents >= :minPriceCents', {
        minPriceCents: criteria.minPriceCents,
      });
    }

    if (criteria.maxPriceCents !== undefined) {
      query.andWhere('product.priceCents <= :maxPriceCents', {
        maxPriceCents: criteria.maxPriceCents,
      });
    }

    if (criteria.minRating !== undefined) {
      query.andWhere('product.rating >= :minRating', {
        minRating: criteria.minRating,
      });
    }

    if (criteria.inStock !== undefined) {
      query.andWhere('product.inStock = :inStock', { inStock: criteria.inStock });
    }

    if (criteria.freeShipping !== undefined) {
      query.andWhere('product.freeShipping = :freeShipping', {
        freeShipping: criteria.freeShipping,
      });
    }

    const groups = new Map<string, string[]>();
    for (const attribute of criteria.attributes) {
      const values = groups.get(attribute.key) ?? [];
      values.push(attribute.value);
      groups.set(attribute.key, values);
    }

    let groupIndex = 0;
    for (const [key, values] of groups) {
      const clauses: string[] = [];
      const params: Record<string, string | number | boolean> = {};

      values.forEach((value, valueIndex) => {
        const keyParam = `attrKey_${groupIndex}_${valueIndex}`;
        const valueParam = `attrValue_${groupIndex}_${valueIndex}`;
        const parsed = parseAttributeValue(value);
        params[keyParam] = key;
        params[valueParam] = parsed.value;
        clauses.push(
          `EXISTS (
            SELECT 1 FROM product_attributes attribute_row
            WHERE attribute_row.product_id = product.id
              AND attribute_row.attribute_key = :${keyParam}
              AND attribute_row.${parsed.column} = :${valueParam}
          )`,
        );
      });

      query.andWhere(`(${clauses.join(' OR ')})`, params);
      groupIndex += 1;
    }

    return query;
  }
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

function parseAttributeValue(value: string): {
  column: 'boolean_value' | 'number_value' | 'string_value';
  value: boolean | number | string;
} {
  if (value === 'true' || value === 'false') {
    return { column: 'boolean_value', value: value === 'true' };
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return { column: 'number_value', value: Number(value) };
  }

  return { column: 'string_value', value };
}
