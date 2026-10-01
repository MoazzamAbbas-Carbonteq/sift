import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalogSchema1735689600000 implements MigrationInterface {
  name = 'CreateCatalogSchema1735689600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY,
        "email" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "UQ_categories_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY,
        "category_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "slug" character varying(255) NOT NULL,
        "brand" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "price_cents" integer NOT NULL,
        "rating" numeric(2,1) NOT NULL,
        "review_count" integer NOT NULL,
        "in_stock" boolean NOT NULL,
        "free_shipping" boolean NOT NULL,
        "return_days" integer NOT NULL,
        "image_url" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_products_slug" UNIQUE ("slug"),
        CONSTRAINT "CHK_products_price_cents" CHECK ("price_cents" >= 0),
        CONSTRAINT "CHK_products_rating" CHECK ("rating" >= 0 AND "rating" <= 5),
        CONSTRAINT "CHK_products_review_count" CHECK ("review_count" >= 0),
        CONSTRAINT "CHK_products_return_days" CHECK ("return_days" >= 0),
        CONSTRAINT "FK_products_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_category_id" ON "products" ("category_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_price_cents" ON "products" ("price_cents")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_rating" ON "products" ("rating")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_name" ON "products" ("name")
    `);

    await queryRunner.query(`
      CREATE TABLE "product_attributes" (
        "id" uuid PRIMARY KEY,
        "product_id" uuid NOT NULL,
        "attribute_key" character varying(64) NOT NULL,
        "string_value" character varying(255),
        "number_value" numeric(10,2),
        "boolean_value" boolean,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_product_attributes_one_value" CHECK (
          (CASE WHEN "string_value" IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN "number_value" IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN "boolean_value" IS NOT NULL THEN 1 ELSE 0 END) = 1
        ),
        CONSTRAINT "FK_product_attributes_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_product_attributes_product_id_attribute_key"
      ON "product_attributes" ("product_id", "attribute_key")
    `);

    await queryRunner.query(`
      CREATE TABLE "product_features" (
        "id" uuid PRIMARY KEY,
        "product_id" uuid NOT NULL,
        "label" character varying(255) NOT NULL,
        "sort_order" integer NOT NULL,
        CONSTRAINT "FK_product_features_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product_reviews_summary" (
        "id" uuid PRIMARY KEY,
        "product_id" uuid NOT NULL,
        "positive_themes" jsonb NOT NULL,
        "negative_themes" jsonb NOT NULL,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_product_reviews_summary_product_id" UNIQUE ("product_id"),
        CONSTRAINT "FK_product_reviews_summary_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "carts" (
        "id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL,
        "status" character varying(32) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_carts_status" CHECK ("status" IN ('active', 'checked_out')),
        CONSTRAINT "FK_carts_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_carts_one_active_per_user"
      ON "carts" ("user_id")
      WHERE "status" = 'active'
    `);

    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id" uuid PRIMARY KEY,
        "cart_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_cart_items_quantity" CHECK ("quantity" > 0),
        CONSTRAINT "UQ_cart_items_cart_id_product_id" UNIQUE ("cart_id", "product_id"),
        CONSTRAINT "FK_cart_items_cart_id" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_cart_items_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL,
        "status" character varying(32) NOT NULL,
        "subtotal_cents" integer NOT NULL,
        "shipping_cents" integer NOT NULL,
        "tax_cents" integer NOT NULL,
        "total_cents" integer NOT NULL,
        "shipping_name" character varying(255) NOT NULL,
        "shipping_address" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_orders_money" CHECK (
          "subtotal_cents" >= 0 AND "shipping_cents" >= 0 AND "tax_cents" >= 0 AND "total_cents" >= 0
        ),
        CONSTRAINT "CHK_orders_status" CHECK ("status" = 'placed'),
        CONSTRAINT "FK_orders_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid PRIMARY KEY,
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "product_name" character varying(255) NOT NULL,
        "unit_price_cents" integer NOT NULL,
        "quantity" integer NOT NULL,
        "line_total_cents" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_order_items_snapshot" CHECK (
          "unit_price_cents" >= 0 AND "quantity" > 0 AND "line_total_cents" >= 0
        ),
        CONSTRAINT "FK_order_items_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_items_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "carts"`);
    await queryRunner.query(`DROP TABLE "product_reviews_summary"`);
    await queryRunner.query(`DROP TABLE "product_features"`);
    await queryRunner.query(`DROP TABLE "product_attributes"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
