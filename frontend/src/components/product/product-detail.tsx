"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { QueryError } from "@/components/feedback/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddCartItem } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import { errorMessage, formatCents, formatCount, formatRating } from "@/lib/format";

export function ProductDetail({ id }: { id: string }) {
  const product = useProduct(id);
  const addToCart = useAddCartItem();
  const [quantity, setQuantity] = useState(1);
  const quantityIsValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;

  if (product.isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (product.isError || !product.data) {
    return (
      <QueryError error={product.error ?? new Error("Product not found")} onRetry={() => void product.refetch()} />
    );
  }

  const item = product.data;

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <ProductImage
        src={item.imageUrl}
        alt={item.name}
        priority
        sizes="(min-width: 768px) 480px, 100vw"
      />
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {item.brand} · {item.category.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatRating(item.rating)} · {formatCount(item.reviewCount)} ratings
        </p>
        <p className="text-2xl font-semibold">{formatCents(item.priceCents)}</p>
        <ul className="flex flex-col gap-1 text-sm">
          <li>{item.inStock ? "In stock" : "Out of stock"}</li>
          <li>{item.freeShipping ? "Free shipping" : "Shipping fee applies at checkout"}</li>
          <li>{item.returnDays}-day returns</li>
        </ul>
        {item.features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.features.map((feature) => (
              <Badge key={feature.label} variant="secondary">
                {feature.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="text-sm leading-6">{item.description}</p>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!item.inStock || !quantityIsValid || addToCart.isPending) return;
            addToCart.mutate({ productId: item.id, quantity });
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={99}
              value={quantity}
              disabled={!item.inStock || addToCart.isPending}
              onChange={(event) => setQuantity(event.target.valueAsNumber)}
              className="w-24"
            />
          </div>
          <Button type="submit" disabled={!item.inStock || !quantityIsValid || addToCart.isPending}>
            {item.inStock ? (addToCart.isPending ? "Adding…" : "Add to cart") : "Out of stock"}
          </Button>
        </form>
        {addToCart.isError ? (
          <p className="text-sm text-destructive">{errorMessage(addToCart.error)}</p>
        ) : null}
        {addToCart.isSuccess ? (
          <p className="text-sm text-muted-foreground">Added to cart.</p>
        ) : null}
        <ReviewThemes summary={item.reviewSummary} />
      </div>
    </article>
  );
}

function ReviewThemes({
  summary,
}: {
  summary: {
    positiveThemes: { label: string; percentage: number }[];
    negativeThemes: { label: string; percentage: number }[];
  } | null;
}) {
  if (!summary) return null;

  return (
    <section className="flex flex-col gap-3 border-t pt-4">
      <h2 className="text-base font-medium">Review themes</h2>
      <p className="text-sm text-muted-foreground">
        Seeded summary of review themes, not a live review sample.
      </p>
      <ThemeList title="Often mentioned" themes={summary.positiveThemes} />
      <ThemeList title="Also mentioned" themes={summary.negativeThemes} />
    </section>
  );
}

function ThemeList({
  title,
  themes,
}: {
  title: string;
  themes: { label: string; percentage: number }[];
}) {
  if (themes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="flex flex-col gap-1">
        {themes.map((theme) => (
          <li key={theme.label} className="flex justify-between gap-4 text-sm">
            <span>{theme.label}</span>
            <span className="text-muted-foreground tabular-nums">{theme.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
}
