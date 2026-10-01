"use client";

import Link from "next/link";
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
}: {
  product: ProductSummary;
  priority?: boolean;
}) {
  const addToCart = useAddCartItem();
  const pending =
    addToCart.isPending && addToCart.variables?.productId === product.id;
  const failed =
    addToCart.isError && addToCart.variables?.productId === product.id;

  return (
    <Card className="h-full">
      <Link href={`/products/${product.id}`} className="block">
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
          <Link href={`/products/${product.id}`} className="hover:underline">
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
        <Button
          type="button"
          disabled={!product.inStock || pending}
          onClick={() =>
            addToCart.mutate({ productId: product.id, quantity: 1 })
          }
        >
          {product.inStock ? (pending ? "Adding…" : "Add to cart") : "Out of stock"}
        </Button>
        {failed ? (
          <p className="text-sm text-destructive">{errorMessage(addToCart.error)}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
