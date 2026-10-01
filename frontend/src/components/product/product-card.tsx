"use client";

import Link from "next/link";
import { CompareButton } from "@/components/compare/compare-button";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddCartItem } from "@/hooks/useCart";
import type { ProductSummary } from "@/lib/api/products";
import { errorMessage, formatCents, formatCount, formatRating } from "@/lib/format";

export function ProductCard({
  product,
  priority = false,
  showCompare = false,
}: {
  product: ProductSummary;
  priority?: boolean;
  showCompare?: boolean;
}) {
  const addToCart = useAddCartItem();
  const pending =
    addToCart.isPending && addToCart.variables?.productId === product.id;
  const failed =
    addToCart.isError && addToCart.variables?.productId === product.id;

  return (
    <Card className="h-full">
      <Link
        href={`/products/${product.id}`}
        className="block rounded-t-xl focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          priority={priority}
          sizes="(min-width: 1024px) 240px, 45vw"
        />
      </Link>
      <CardHeader>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <CardTitle>
          <Link
            href={`/products/${product.id}`}
            className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-3">
        <p className="text-base font-semibold">{formatCents(product.priceCents)}</p>
        <p className="text-sm text-muted-foreground">
          {formatRating(product.rating)} · {formatCount(product.reviewCount)} ratings
        </p>
        <p className="text-sm">
          {product.inStock ? "In stock" : "Out of stock"}
          {" · "}
          {product.freeShipping ? "Free shipping" : "Shipping fee"}
        </p>
        {product.features.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((feature) => (
              <Badge key={feature.label} variant="secondary">
                {feature.label}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="min-w-28 flex-1"
            disabled={!product.inStock || pending}
            onClick={() =>
              addToCart.mutate({ productId: product.id, quantity: 1 })
            }
          >
            {product.inStock ? (pending ? "Adding…" : "Add to cart") : "Out of stock"}
          </Button>
          {showCompare ? (
            <CompareButton productId={product.id} className="flex-1" />
          ) : null}
        </div>
        {failed ? (
          <p className="text-sm text-destructive">{errorMessage(addToCart.error)}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
