import { calculateOrderTotals, FLAT_SHIPPING_CENTS } from './order-totals.js';

describe('calculateOrderTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(calculateOrderTotals([])).toEqual({
      subtotalCents: 0,
      shippingCents: 0,
      taxCents: 0,
      totalCents: 0,
    });
  });

  it('ships free when every line has free shipping', () => {
    const totals = calculateOrderTotals([
      { priceCents: 25000, quantity: 1, freeShipping: true },
      { priceCents: 1000, quantity: 2, freeShipping: true },
    ]);

    expect(totals.subtotalCents).toBe(27000);
    expect(totals.shippingCents).toBe(0);
    expect(totals.taxCents).toBe(2160);
    expect(totals.totalCents).toBe(29160);
  });

  it('adds flat shipping when any line is not free', () => {
    const totals = calculateOrderTotals([
      { priceCents: 25000, quantity: 1, freeShipping: true },
      { priceCents: 4999, quantity: 1, freeShipping: false },
    ]);

    expect(totals.subtotalCents).toBe(29999);
    expect(totals.shippingCents).toBe(FLAT_SHIPPING_CENTS);
    expect(totals.taxCents).toBe(Math.round((29999 * 8) / 100));
    expect(totals.totalCents).toBe(
      totals.subtotalCents + totals.shippingCents + totals.taxCents,
    );
  });

  it('rounds tax to the nearest cent', () => {
    const totals = calculateOrderTotals([
      { priceCents: 101, quantity: 1, freeShipping: true },
    ]);

    expect(totals.taxCents).toBe(8);
    expect(totals.totalCents).toBe(109);
  });
});
