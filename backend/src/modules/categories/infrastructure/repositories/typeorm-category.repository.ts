import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CategoryRecord } from '../../../products/domain/product-search.js';
import type { CategoryRepository } from '../../domain/repositories/category.repository.js';
import { Category } from '../persistence/category.entity.js';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async list(): Promise<CategoryRecord[]> {
    const rows = await this.categories.find({ order: { name: 'ASC' } });
    return rows.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  }
}
