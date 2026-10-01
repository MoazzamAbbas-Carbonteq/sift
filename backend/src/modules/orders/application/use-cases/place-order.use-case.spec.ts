import { BadRequestException, ConflictException } from '@nestjs/common';
import type { CheckoutCart } from '../../domain/order.js';
import type { OrderRepository } from '../../domain/repositories/order.repository.js';
import { PlaceOrderUseCase } from './place-order.use-case.js';

const shipping = {
  shippingName: 'Alex Rivera',
  shippingAddress: '120 Market Street, Seattle, WA 98101',
};

function cartWith(priceCents: number, quantity: number, inStock = true): CheckoutCart {
  return {
    id: 'e1000001-0000-4000-8000-000000000001',
    items: [
      {
        quantity,
        product: {
          id: 'a1000001-0000-4000-8000-000000000001',
          name: 'Sony WH-1000XM5',
          priceCents,
          freeShipping: false,
          inStock,
        },
      },
    ],
  };
}

function repositoryFor(cart: CheckoutCart): OrderRepository {
  return {
    listForDemoUser: vi.fn(),
    findForDemoUser: vi.fn(),
    place: async (build) => {
      const draft = await build(cart);
      return {
        id: 'b1000001-0000-4000-8000-000000000001',
        status: 'placed',
        subtotalCents: draft.subtotalCents,
        shippingCents: draft.shippingCents,
        taxCents: draft.taxCents,
        totalCents: draft.totalCents,
        shippingName: draft.shippingName,
        shippingAddress: draft.shippingAddress,
        createdAt: '2026-10-01T00:00:00.000Z',
        items: draft.items.map((item, index) => ({
          ...item,
          id: `line-${index}`,
        })),
      };
    },
  };
}

describe('PlaceOrderUseCase', () => {
  it('snapshots the catalog unit price and calculates totals on the server', async () => {
    const useCase = new PlaceOrderUseCase(repositoryFor(cartWith(39999, 2)));

    const order = await useCase.execute(shipping);

    expect(order.items[0]).toMatchObject({
      productName: 'Sony WH-1000XM5',
      unitPriceCents: 39999,
      quantity: 2,
      lineTotalCents: 79998,
    });
    expect(order.subtotalCents).toBe(79998);
    expect(order.shippingCents).toBe(599);
    expect(order.taxCents).toBe(Math.round((79998 * 8) / 100));
    expect(order.totalCents).toBe(order.subtotalCents + order.shippingCents + order.taxCents);
  });

  it('uses the current catalog price when it differs from another product price', async () => {
    const useCase = new PlaceOrderUseCase(repositoryFor(cartWith(15000, 1)));

    const order = await useCase.execute(shipping);

    expect(order.items[0]?.unitPriceCents).toBe(15000);
    expect(order.items[0]?.lineTotalCents).toBe(15000);
    expect(order.subtotalCents).toBe(15000);
    expect(order.totalCents).toBe(15000 + 599 + Math.round((15000 * 8) / 100));
  });

  it('rejects an empty cart', async () => {
    const useCase = new PlaceOrderUseCase(
      repositoryFor({ id: 'cart', items: [] }),
    );

    await expect(useCase.execute(shipping)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an out-of-stock line', async () => {
    const useCase = new PlaceOrderUseCase(repositoryFor(cartWith(39999, 1, false)));

    await expect(useCase.execute(shipping)).rejects.toBeInstanceOf(ConflictException);
  });
});
