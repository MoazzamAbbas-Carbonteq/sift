"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { SearchForm } from "@/components/layout/search-form";
import { QueryError } from "@/components/feedback/query-state";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { featuredProductQuery } from "@/lib/api/products";

export function HomeContent() {
  const categories = useCategories();
  const products = useProducts(featuredProductQuery);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight">
          Find the right product faster
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Search a focused catalog, then narrow by price, rating, stock, and the details that matter for that category.
        </p>
        <div className="max-w-xl">
          <SearchForm id="home-search" inputClassName="h-9" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Shop by category</h2>
        {categories.isLoading ? (
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : null}
        {categories.isError ? (
          <QueryError error={categories.error} onRetry={() => void categories.refetch()} />
        ) : null}
        {categories.data ? (
          <div className="flex flex-wrap gap-2">
            {categories.data.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                nativeButton={false}
                render={<Link href={`/search?category=${category.slug}`} />}
              >
                {category.name}
              </Button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Well rated right now</h2>
        {products.isLoading ? <ProductGridSkeleton /> : null}
        {products.isError ? (
          <QueryError error={products.error} onRetry={() => void products.refetch()} />
        ) : null}
        {products.data ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.data.items.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
