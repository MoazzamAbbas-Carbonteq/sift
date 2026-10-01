import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { SearchProductsUseCase } from './application/use-cases/search-products.use-case.js';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.js';
import { ProductAttribute } from './infrastructure/persistence/product-attribute.entity.js';
import { ProductFeature } from './infrastructure/persistence/product-feature.entity.js';
import { ProductReviewSummary } from './infrastructure/persistence/product-review-summary.entity.js';
import { Product } from './infrastructure/persistence/product.entity.js';
import { TypeOrmProductRepository } from './infrastructure/repositories/typeorm-product.repository.js';
import { ProductsController } from './presentation/products.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductAttribute,
      ProductFeature,
      ProductReviewSummary,
    ]),
  ],
  controllers: [ProductsController],
  exports: [PRODUCT_REPOSITORY],
  providers: [
    SearchProductsUseCase,
    GetProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
  ],
})
export class ProductsModule {}
