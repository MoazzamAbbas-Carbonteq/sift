import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AddCartItemDto, UpdateCartItemDto } from './cart-item.dto.js';

const productId = 'a1000001-0000-4000-8000-000000000001';

describe('cart item quantity', () => {
  it.each([0, -1, 1.5, 'nope'])(
    'rejects add quantity %s',
    async (quantity) => {
      const dto = plainToInstance(AddCartItemDto, { productId, quantity });
      const errors = await validate(dto);

      expect(errors.map((error) => error.property)).toContain('quantity');
    },
  );

  it.each([0, -2, 2.2])('rejects update quantity %s', async (quantity) => {
    const dto = plainToInstance(UpdateCartItemDto, { quantity });
    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain('quantity');
  });

  it('accepts a positive integer quantity', async () => {
    const dto = plainToInstance(AddCartItemDto, { productId, quantity: '2' });
    const errors = await validate(dto);

    expect(errors).toEqual([]);
    expect(dto.quantity).toBe(2);
  });
});
