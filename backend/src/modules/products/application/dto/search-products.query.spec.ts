import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SearchProductsQueryDto } from './search-products.query.js';

describe('SearchProductsQueryDto', () => {
  it('rejects an invalid query', async () => {
    const dto = plainToInstance(SearchProductsQueryDto, {
      page: 0,
      sort: 'cheap',
      minPrice: -1,
      limit: 100,
      attribute: 'BadKey:travel',
    });

    const errors = await validate(dto);
    const fields = errors.map((error) => error.property);

    expect(fields).toEqual(
      expect.arrayContaining(['page', 'sort', 'minPrice', 'limit', 'attribute']),
    );
  });

  it('accepts a transformed catalog query', async () => {
    const dto = plainToInstance(SearchProductsQueryDto, {
      q: 'headphones',
      category: 'headphones',
      minPrice: '10000',
      maxPrice: '40000',
      minRating: '4.5',
      inStock: 'true',
      freeShipping: 'false',
      sort: 'rating_desc',
      page: '2',
      limit: '12',
      attribute: 'use_case:travel',
    });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
    expect(dto.minPrice).toBe(10000);
    expect(dto.inStock).toBe(true);
    expect(dto.freeShipping).toBe(false);
    expect(dto.page).toBe(2);
    expect(dto.attribute).toEqual(['use_case:travel']);
  });
});
