import { ListCategoriesUseCase } from './list-categories.use-case.js';
import type { CategoryRepository } from '../../domain/repositories/category.repository.js';

describe('ListCategoriesUseCase', () => {
  it('returns categories from the repository', async () => {
    const categories = [
      {
        id: 'c1000001-0000-4000-8000-000000000001',
        name: 'Headphones',
        slug: 'headphones',
      },
    ];
    const list = vi.fn<CategoryRepository['list']>().mockResolvedValue(categories);
    const repository: CategoryRepository = { list };
    const useCase = new ListCategoriesUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(categories);
    expect(list).toHaveBeenCalledOnce();
  });
});
