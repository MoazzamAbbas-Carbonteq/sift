"use client";

import Link from "next/link";
import { MoneySummary } from "@/components/checkout/money-summary";
import { QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";
import { formatCents, formatOrderDate } from "@/lib/format";

export function OrderConfirmation({ id }: { id: string }) {
  const order = useOrder(id);

  if (order.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (order.isError || !order.data) {
    return (
      <QueryError
        error={order.error ?? new Error("Order not found")}
        onRetry={() => void order.refetch()}
      />
    );
  }

  const placed = order.data;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeading
        title="Order placed"
        description="This confirmation uses the prices captured at purchase."
      />
      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <div>
          <h2 className="text-sm font-medium">Order number</h2>
          <p className="text-sm break-all">{placed.id}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatOrderDate(placed.createdAt)} · {placed.status}
        </p>
        <div>
          <h2 className="text-sm font-medium">Ship to</h2>
          <p className="text-sm">{placed.shippingName}</p>
          <p className="text-sm text-muted-foreground">{placed.shippingAddress}</p>
        </div>
        <ul className="flex flex-col gap-3">
          {placed.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                <Link
                  href={`/products/${item.productId}`}
                  className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {item.productName}
                </Link>
                <span className="block text-muted-foreground">
                  {formatCents(item.unitPriceCents)} × {item.quantity}
                </span>
              </span>
              <span className="tabular-nums">{formatCents(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <MoneySummary
          subtotalCents={placed.subtotalCents}
          shippingCents={placed.shippingCents}
          taxCents={placed.taxCents}
          totalCents={placed.totalCents}
        />
      </div>
      <Button variant="outline" nativeButton={false} render={<Link href="/orders" />}>
        View order history
      </Button>
    </div>
  );
}
