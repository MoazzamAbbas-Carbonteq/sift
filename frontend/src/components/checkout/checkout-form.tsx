"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoneySummary } from "@/components/checkout/money-summary";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/useOrders";
import { errorMessage, formatCents } from "@/lib/format";

export function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const placeOrder = usePlaceOrder();
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  if (cart.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (cart.isError || !cart.data) {
    return <QueryError error={cart.error} onRetry={() => void cart.refetch()} />;
  }

  if (cart.data.items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeading title="Checkout" />
        <EmptyState
          title="Nothing to check out"
          description="Add a product to your cart before placing an order."
          action={
            <Button nativeButton={false} render={<Link href="/search" />}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  const name = shippingName.trim();
  const address = shippingAddress.trim();
  const outOfStock = cart.data.items.some((item) => !item.inStock);
  const canPlace =
    name.length > 0 &&
    address.length > 0 &&
    name.length <= 255 &&
    address.length <= 2000 &&
    !outOfStock &&
    !placeOrder.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Checkout"
        description="Enter a shipping name and address. Payment is confirmed here without a charge."
      />
      <form
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canPlace) return;
          placeOrder.mutate(
            { shippingName: name, shippingAddress: address },
            {
              onSuccess: (order) => {
                router.push(`/orders/${order.id}`);
              },
            },
          );
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-name">Name</Label>
            <Input
              id="shipping-name"
              value={shippingName}
              maxLength={255}
              autoComplete="name"
              required
              disabled={placeOrder.isPending}
              onChange={(event) => setShippingName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-address">Address</Label>
            <Input
              id="shipping-address"
              value={shippingAddress}
              maxLength={2000}
              autoComplete="street-address"
              required
              disabled={placeOrder.isPending}
              onChange={(event) => setShippingAddress(event.target.value)}
            />
          </div>
          <section className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <h2 className="text-base font-medium">Payment</h2>
            <p className="mt-1 text-sm text-muted-foreground">Card ending in 4242.</p>
          </section>
          {outOfStock ? (
            <p className="text-sm text-destructive">
              Remove out-of-stock items from the cart before placing the order.
            </p>
          ) : null}
          {placeOrder.isError ? (
            <p className="text-sm text-destructive">{errorMessage(placeOrder.error)}</p>
          ) : null}
          <Button type="submit" disabled={!canPlace}>
            {placeOrder.isPending ? "Placing order…" : "Place order"}
          </Button>
        </div>
        <aside className="flex h-fit flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <h2 className="text-base font-medium">Order summary</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {cart.data.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {item.name} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatCents(item.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <MoneySummary
            subtotalCents={cart.data.subtotalCents}
            shippingCents={cart.data.shippingCents}
            taxCents={cart.data.taxCents}
            totalCents={cart.data.totalCents}
          />
        </aside>
      </form>
    </div>
  );
}
