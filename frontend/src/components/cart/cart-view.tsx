"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import { MoneySummary } from "@/components/checkout/money-summary";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { errorMessage, formatCents } from "@/lib/format";

export function CartView() {
  const cart = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const pendingLine = updateItem.isPending
    ? updateItem.variables.id
    : removeItem.isPending
      ? removeItem.variables
      : undefined;

  if (cart.isLoading) {
    return <CartSkeleton />;
  }

  if (cart.isError || !cart.data) {
    return <QueryError error={cart.error} onRetry={() => void cart.refetch()} />;
  }

  if (cart.data.items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeading title="Cart" />
        <EmptyState
          title="Your cart is empty"
          description="Search the catalog and add a product when you are ready."
          action={
            <Button nativeButton={false} render={<Link href="/search" />}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  const blocked = cart.data.items.some((item) => !item.inStock);
  const actionError = updateItem.error ?? removeItem.error;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Cart" description="Quantities update on the server. Checkout uses these prices." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <ul className="flex flex-col gap-4">
          {cart.data.items.map((item) => {
            const pending = pendingLine === item.id;
            return (
              <li key={item.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-xl bg-card p-3 ring-1 ring-foreground/10">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  sizes="80px"
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="rounded-sm font-medium hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatCents(item.priceCents)} each
                    {item.freeShipping ? " · Free shipping" : ""}
                    {item.inStock ? "" : " · Out of stock"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={pending || item.quantity <= 1 || !item.inStock}
                      onClick={() =>
                        updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })
                      }
                    >
                      −
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={pending || item.quantity >= 99 || !item.inStock}
                      onClick={() =>
                        updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })
                      }
                    >
                      +
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => removeItem.mutate(item.id)}
                    >
                      Remove
                    </Button>
                    <p className="ml-auto text-sm font-medium tabular-nums">
                      {formatCents(item.lineTotalCents)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <aside className="flex h-fit flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <MoneySummary
            subtotalCents={cart.data.subtotalCents}
            shippingCents={cart.data.shippingCents}
            taxCents={cart.data.taxCents}
            totalCents={cart.data.totalCents}
          />
          {blocked ? (
            <p className="text-sm text-destructive">
              Remove out-of-stock items before checkout.
            </p>
          ) : null}
          {actionError ? (
            <p className="text-sm text-destructive">{errorMessage(actionError)}</p>
          ) : null}
          {blocked ? (
            <Button type="button" disabled>
              Checkout
            </Button>
          ) : (
            <Button nativeButton={false} render={<Link href="/checkout" />}>
              Checkout
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
