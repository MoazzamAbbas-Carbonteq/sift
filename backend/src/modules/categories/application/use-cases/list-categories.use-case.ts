import { Inject, Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '../dto/category-response.dto.js';
import {
  CATEGORY_REPOSITORY,
  type CategoryRepository,
} from '../../domain/repositories/category.repository.js';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categories: CategoryRepository,
  ) {}

  async execute(): Promise<CategoryResponseDto[]> {
    return this.categories.list();
  }
}
