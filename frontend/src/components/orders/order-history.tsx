"use client";

import Link from "next/link";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import type { OrderItem } from "@/lib/api/orders";
import { formatCents, formatOrderDate } from "@/lib/format";

export function OrderHistory() {
  const orders = useOrders();

  if (orders.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (orders.isError) {
    return <QueryError error={orders.error} onRetry={() => void orders.refetch()} />;
  }

  if (!orders.data || orders.data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeading title="Orders" />
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will show up here with the prices from checkout."
          action={
            <Button nativeButton={false} render={<Link href="/search" />}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Orders" description="Prices stay at what you paid." />
      <ul className="flex flex-col gap-3">
        {orders.data.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium capitalize">{order.status}</p>
                <p className="text-sm text-muted-foreground">{formatOrderDate(order.createdAt)}</p>
                <p className="text-sm">{itemSummary(order.items)}</p>
              </div>
              <p className="font-medium tabular-nums">{formatCents(order.totalCents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function itemSummary(items: OrderItem[]): string {
  const first = items[0];
  if (!first) {
    return "No items";
  }

  const label = `${first.productName} × ${first.quantity}`;
  if (items.length === 1) {
    return label;
  }

  const rest = items.length - 1;
  return `${label} and ${rest} more`;
}
