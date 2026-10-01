import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.js';
import { Category } from './infrastructure/persistence/category.entity.js';
import { TypeOrmCategoryRepository } from './infrastructure/repositories/typeorm-category.repository.js';
import { CategoriesController } from './presentation/categories.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    ListCategoriesUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: TypeOrmCategoryRepository,
    },
  ],
})
export class CategoriesModule {}
