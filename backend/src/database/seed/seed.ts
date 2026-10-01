import type { DataSource, EntityManager } from 'typeorm';
import { CATALOG, type CatalogAttribute, type CatalogProduct } from './catalog.js';
import {
  CATEGORY_IDS,
  childId,
  GUEST_CART_ID,
  GUEST_EMAIL,
  GUEST_NAME,
  GUEST_USER_ID,
  productId,
} from './ids.js';
import { productImageUrl } from './product-images.js';

const CATEGORIES = [
  { id: CATEGORY_IDS.headphones, name: 'Headphones', slug: 'headphones' },
  { id: CATEGORY_IDS.laptops, name: 'Laptops', slug: 'laptops' },
  { id: CATEGORY_IDS.smartphones, name: 'Smartphones', slug: 'smartphones' },
  { id: CATEGORY_IDS.monitors, name: 'Monitors', slug: 'monitors' },
  { id: CATEGORY_IDS.keyboards, name: 'Keyboards', slug: 'keyboards' },
] as const;

const SEEDED_AT = '2026-01-01T00:00:00.000Z';

export type SeedCounts = {
  categories: number;
  users: number;
  activeCarts: number;
  products: number;
};

export async function seedCatalog(dataSource: DataSource): Promise<SeedCounts> {
  if (CATALOG.length !== 30) {
    throw new Error(`Expected 30 catalog products, found ${CATALOG.length}.`);
  }

  const ids = CATALOG.map((_, index) => productId(index + 1));

  await dataSource.transaction(async (manager) => {
    for (const category of CATEGORIES) {
      await upsertCategory(manager, category);
    }

    await upsertUser(manager);
    for (const [index, item] of CATALOG.entries()) {
      await upsertProduct(manager, ids[index] ?? missingId(index), item, index);
    }

    await deleteChildren(manager, ids);
    await insertChildren(manager, ids);
    await upsertCart(manager);
  });

  return verifySeed(dataSource, ids);
}

async function upsertCategory(
  manager: EntityManager,
  category: (typeof CATEGORIES)[number],
): Promise<void> {
  await manager.query(
    `INSERT INTO categories (id, name, slug, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $4)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       slug = EXCLUDED.slug,
       updated_at = EXCLUDED.updated_at`,
    [category.id, category.name, category.slug, SEEDED_AT],
  );
}

async function upsertUser(manager: EntityManager): Promise<void> {
  await manager.query(
    `INSERT INTO users (id, email, name, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $4)
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       name = EXCLUDED.name,
       updated_at = EXCLUDED.updated_at`,
    [GUEST_USER_ID, GUEST_EMAIL, GUEST_NAME, SEEDED_AT],
  );
}

async function upsertProduct(
  manager: EntityManager,
  id: string,
  item: CatalogProduct,
  index: number,
): Promise<void> {
  const categoryId = CATEGORY_IDS[item.categorySlug];
  const createdAt = productTimestamp(index);

  await manager.query(
    `INSERT INTO products (
       id, category_id, name, slug, brand, description, price_cents, rating,
       review_count, in_stock, free_shipping, return_days, image_url, created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $14
     )
     ON CONFLICT (id) DO UPDATE SET
       category_id = EXCLUDED.category_id,
       name = EXCLUDED.name,
       slug = EXCLUDED.slug,
       brand = EXCLUDED.brand,
       description = EXCLUDED.description,
       price_cents = EXCLUDED.price_cents,
       rating = EXCLUDED.rating,
       review_count = EXCLUDED.review_count,
       in_stock = EXCLUDED.in_stock,
       free_shipping = EXCLUDED.free_shipping,
       return_days = EXCLUDED.return_days,
       image_url = EXCLUDED.image_url,
       created_at = EXCLUDED.created_at,
       updated_at = EXCLUDED.updated_at`,
    [
      id,
      categoryId,
      item.name,
      item.slug,
      item.brand,
      item.description,
      item.priceCents,
      item.rating,
      item.reviewCount,
      item.inStock,
      item.freeShipping,
      item.returnDays,
      productImageUrl(item.slug),
      createdAt,
    ],
  );
}

async function deleteChildren(manager: EntityManager, ids: string[]): Promise<void> {
  const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
  await manager.query(
    `DELETE FROM product_attributes WHERE product_id IN (${placeholders})`,
    ids,
  );
  await manager.query(
    `DELETE FROM product_features WHERE product_id IN (${placeholders})`,
    ids,
  );
  await manager.query(
    `DELETE FROM product_reviews_summary WHERE product_id IN (${placeholders})`,
    ids,
  );
}

async function insertChildren(manager: EntityManager, ids: string[]): Promise<void> {
  let attributeIndex = 1;
  let featureIndex = 1;

  for (const [index, item] of CATALOG.entries()) {
    const id = ids[index] ?? missingId(index);
    const createdAt = productTimestamp(index);
    const attributes: CatalogAttribute[] = [
      ...item.useCases.map((useCase) => ({
        kind: 'string' as const,
        key: 'use_case',
        value: useCase,
      })),
      ...item.attributes,
    ];

    for (const attribute of attributes) {
      await manager.query(
        `INSERT INTO product_attributes (
           id, product_id, attribute_key, string_value, number_value, boolean_value, created_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          childId('f1000001', attributeIndex),
          id,
          attribute.key,
          attribute.kind === 'string' ? attribute.value : null,
          attribute.kind === 'number' ? attribute.value : null,
          attribute.kind === 'boolean' ? attribute.value : null,
          createdAt,
        ],
      );
      attributeIndex += 1;
    }

    for (const [sortOrder, label] of item.features.entries()) {
      await manager.query(
        `INSERT INTO product_features (id, product_id, label, sort_order)
         VALUES ($1, $2, $3, $4)`,
        [childId('f2000001', featureIndex), id, label, sortOrder],
      );
      featureIndex += 1;
    }

    await manager.query(
      `INSERT INTO product_reviews_summary (
         id, product_id, positive_themes, negative_themes, updated_at
       ) VALUES ($1, $2, $3::jsonb, $4::jsonb, $5)`,
      [
        childId('f3000001', index + 1),
        id,
        JSON.stringify(item.positiveThemes),
        JSON.stringify(item.negativeThemes),
        createdAt,
      ],
    );
  }
}

async function upsertCart(manager: EntityManager): Promise<void> {
  await manager.query(
    `INSERT INTO carts (id, user_id, status, created_at, updated_at)
     VALUES ($1, $2, 'active', $3, $3)
     ON CONFLICT (id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       status = EXCLUDED.status,
       updated_at = EXCLUDED.updated_at`,
    [GUEST_CART_ID, GUEST_USER_ID, SEEDED_AT],
  );
}

async function verifySeed(dataSource: DataSource, ids: string[]): Promise<SeedCounts> {
  const placeholders = ids.map((_, index) => `$${index + 3}`).join(', ');
  const rows: Array<{
    categories: string;
    users: string;
    active_carts: string;
    products: string;
  }> = await dataSource.query(
    `SELECT
       (SELECT COUNT(*) FROM categories WHERE slug IN ('headphones', 'laptops', 'smartphones', 'monitors', 'keyboards')) AS categories,
       (SELECT COUNT(*) FROM users WHERE id = $1) AS users,
       (SELECT COUNT(*) FROM carts WHERE id = $2 AND status = 'active') AS active_carts,
       (SELECT COUNT(*) FROM products WHERE id IN (${placeholders})) AS products`,
    [GUEST_USER_ID, GUEST_CART_ID, ...ids],
  );

  const row = rows[0];
  if (!row) {
    throw new Error('Seed verification query returned no row.');
  }

  const counts = {
    categories: Number(row.categories),
    users: Number(row.users),
    activeCarts: Number(row.active_carts),
    products: Number(row.products),
  };

  if (
    counts.categories !== 5 ||
    counts.users !== 1 ||
    counts.activeCarts !== 1 ||
    counts.products !== 30
  ) {
    throw new Error(
      `Seed verification failed: ${counts.categories} categories, ${counts.users} users, ${counts.activeCarts} active carts, ${counts.products} products.`,
    );
  }

  return counts;
}

function productTimestamp(index: number): string {
  const date = new Date(Date.UTC(2026, 0, 1));
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString();
}

function missingId(index: number): never {
  throw new Error(`Missing product id at index ${index}.`);
}
