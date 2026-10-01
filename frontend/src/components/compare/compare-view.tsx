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

function CompareTable({ products }: { products: ProductDetail[] }) {
  const attributeKeys = sharedAttributeKeys(products, 4);
  const rows = [
    { label: "Price", values: products.map((product) => formatCents(product.priceCents)) },
    {
      label: "Rating",
      values: products.map(
        (product) =>
          `${formatRating(product.rating)} · ${formatCount(product.reviewCount)} ratings`,
      ),
    },
    {
      label: "Availability",
      values: products.map((product) => (product.inStock ? "In stock" : "Out of stock")),
    },
    {
      label: "Shipping",
      values: products.map((product) =>
        product.freeShipping ? "Free shipping" : "Shipping fee",
      ),
    },
    {
      label: "Returns",
      values: products.map((product) => `${product.returnDays}-day returns`),
    },
    ...attributeKeys.map((key) => ({
      label: attributeLabel(key),
      values: products.map(
        (product) => formatAttribute(findAttribute(product.attributes, key)) ?? "—",
      ),
    })),
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">Product comparison</caption>
        <thead>
          <tr className="border-b">
            <th className="w-36 py-3 pr-4 text-left font-medium" scope="col">
              <span className="sr-only">Detail</span>
            </th>
            {products.map((product) => (
              <th key={product.id} className="px-3 py-3 text-left font-medium" scope="col">
                <Link href={`/products/${product.id}`} className="hover:underline">
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
          {rows.map((row) => (
            <tr key={row.label} className="border-b">
              <th className="py-3 pr-4 text-left font-medium" scope="row">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={`${row.label}-${products[index]?.id}`} className="px-3 py-3">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
