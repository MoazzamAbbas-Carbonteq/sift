export const FLAT_SHIPPING_CENTS = 599;
export const TAX_RATE_PERCENT = 8;

export type OrderTotalLine = {
  priceCents: number;
  quantity: number;
  freeShipping: boolean;
};

export type OrderTotals = {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export function calculateOrderTotals(lines: OrderTotalLine[]): OrderTotals {
  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  );
  const shippingCents = lines.every((line) => line.freeShipping)
    ? 0
    : FLAT_SHIPPING_CENTS;
  const taxCents = Math.round((subtotalCents * TAX_RATE_PERCENT) / 100);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return { subtotalCents, shippingCents, taxCents, totalCents };
}
