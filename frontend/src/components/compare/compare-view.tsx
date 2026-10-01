"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useCompare } from "@/components/compare/compare-selection";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProduct, productKeys, type ProductDetail } from "@/lib/api/products";
import {
  attributeLabel,
  findAttribute,
  formatAttribute,
  sharedAttributeKeys,
} from "@/lib/catalog-facts";
import { formatCents, formatCount, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CompareView({ ids }: { ids: string[] }) {
  const { replace } = useCompare();
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: productKeys.detail(id),
      queryFn: () => fetchProduct(id),
    })),
  });

  useEffect(() => {
    replace(ids);
  }, [replace, ids]);

  if (ids.length < 2) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeading
          title="Compare"
          description="Price, rating, availability, shipping, returns, and a few category details."
        />
        <EmptyState
          title="Select 2 or 3 products"
          description="Use Compare on a result. A fourth product stays blocked."
          action={
            <Button nativeButton={false} render={<Link href="/search" />}>
              Browse products
            </Button>
          }
        />
      </div>
    );
  }

  const pending = queries.some((query) => query.isLoading);
  const failed = queries.find((query) => query.isError);
  const products = queries.flatMap((query) => (query.data ? [query.data] : []));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Compare"
        description="Price, rating, availability, shipping, returns, and a few category details."
      />
      {pending ? <CompareSkeleton /> : null}
      {!pending && failed ? (
        <QueryError
          error={failed.error}
          onRetry={() => {
            for (const query of queries) {
              void query.refetch();
            }
          }}
        />
      ) : null}
      {!pending && !failed && products.length >= 2 ? (
        <CompareTable products={products} />
      ) : null}
    </div>
  );
}

type CompareRow = {
  label: string;
  values: string[];
  numeric: boolean;
};

function CompareTable({ products }: { products: ProductDetail[] }) {
  const rows = headphoneRows(products) ?? genericRows(products);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">Product comparison</caption>
        <thead>
          <tr className="border-b">
            <th className="w-40 py-3 pr-4 text-left font-medium" scope="col">
              <span className="sr-only">Detail</span>
            </th>
            {products.map((product) => (
              <th key={product.id} className="px-3 py-3 text-left font-medium" scope="col">
                <Link
                  href={`/products/${product.id}`}
                  className="rounded-sm hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {product.name}
                </Link>
                <span className="mt-1 block font-normal text-muted-foreground">
                  {product.brand}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const differs = new Set(row.values).size > 1;
            return (
              <tr key={row.label} className="border-b">
                <th className="py-3 pr-4 text-left font-medium" scope="row">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${products[index]?.id}`}
                    className={cn(
                      "px-3 py-3",
                      row.numeric && "tabular-nums",
                      differs ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function headphoneRows(products: ProductDetail[]): CompareRow[] | null {
  if (!products.every((product) => product.category.slug === "headphones")) {
    return null;
  }

  return [
    row("Price", products.map((product) => formatCents(product.priceCents)), true),
    row("Rating", products.map((product) => formatRating(product.rating)), true),
    row("Review count", products.map((product) => formatCount(product.reviewCount)), true),
    attributeRow("Battery", "battery_hours", products, true),
    attributeRow("Noise cancellation", "noise_cancellation", products, false),
    attributeRow("Weight", "weight_grams", products, true),
    row(
      "Shipping",
      products.map((product) => (product.freeShipping ? "Free shipping" : "Shipping fee")),
      false,
    ),
    row("Returns", products.map((product) => `${product.returnDays}-day returns`), true),
    row(
      "Availability",
      products.map((product) => (product.inStock ? "In stock" : "Out of stock")),
      false,
    ),
  ];
}

function genericRows(products: ProductDetail[]): CompareRow[] {
  const attributeKeys = sharedAttributeKeys(products, 4);

  return [
    row("Price", products.map((product) => formatCents(product.priceCents)), true),
    row("Rating", products.map((product) => formatRating(product.rating)), true),
    row("Review count", products.map((product) => formatCount(product.reviewCount)), true),
    row(
      "Availability",
      products.map((product) => (product.inStock ? "In stock" : "Out of stock")),
      false,
    ),
    row(
      "Shipping",
      products.map((product) => (product.freeShipping ? "Free shipping" : "Shipping fee")),
      false,
    ),
    row("Returns", products.map((product) => `${product.returnDays}-day returns`), true),
    ...attributeKeys.map((key) =>
      attributeRow(attributeLabel(key), key, products, isNumericAttribute(key)),
    ),
  ];
}

function attributeRow(
  label: string,
  key: string,
  products: ProductDetail[],
  numeric: boolean,
): CompareRow {
  return row(
    label,
    products.map(
      (product) => formatAttribute(findAttribute(product.attributes, key)) ?? "—",
    ),
    numeric,
  );
}

function isNumericAttribute(key: string): boolean {
  return (
    key.endsWith("_hours") ||
    key.endsWith("_grams") ||
    key.endsWith("_gb") ||
    key.endsWith("_kg") ||
    key.endsWith("_mah") ||
    key.endsWith("_hz") ||
    key.endsWith("_inches")
  );
}

function row(label: string, values: string[], numeric: boolean): CompareRow {
  return { label, values, numeric };
}

function CompareSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}
