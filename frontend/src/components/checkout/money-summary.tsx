import { formatCents } from "@/lib/format";

export function MoneySummary({
  subtotalCents,
  shippingCents,
  taxCents,
  totalCents,
}: {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}) {
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Subtotal</dt>
      <dd className="text-right tabular-nums">{formatCents(subtotalCents)}</dd>
      <dt className="text-muted-foreground">Shipping</dt>
      <dd className="text-right tabular-nums">{formatCents(shippingCents)}</dd>
      <dt className="text-muted-foreground">Tax</dt>
      <dd className="text-right tabular-nums">{formatCents(taxCents)}</dd>
      <dt className="font-medium">Total</dt>
      <dd className="text-right text-base font-semibold tabular-nums">
        {formatCents(totalCents)}
      </dd>
    </dl>
  );
}
