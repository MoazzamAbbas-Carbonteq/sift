"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { SearchFilters } from "@/components/product/search-filters";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { sortOptions } from "@/lib/catalog-filters";
import {
  parseProductQuery,
  productSearchHref,
  type ProductQuery,
  type ProductSort,
} from "@/lib/api/products";
import { formatCount } from "@/lib/format";

export function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();
  const query = parseProductQuery(params);
  const products = useProducts(query);
  const categories = useCategories();

  function update(next: ProductQuery) {
    router.push(productSearchHref(next), { scroll: false });
  }

  const page = products.data?.page ?? query.page ?? 1;
  const limit = products.data?.limit ?? query.limit ?? 12;
  const total = products.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={query.q ? `Results for “${query.q}”` : "Browse products"}
        description="Filter by category, price, rating, stock, and shipping. Attribute filters follow the category you pick."
      />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <SearchFilters
            idPrefix="desktop"
            query={query}
            categories={categories.data ?? []}
            onChange={update}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {products.data
                ? `${formatCount(total)} ${total === 1 ? "product" : "products"}`
                : "Loading products"}
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger
                  render={<Button type="button" variant="outline" className="lg:hidden" />}
                >
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6">
                    <SearchFilters
                      idPrefix="mobile"
                      query={query}
                      categories={categories.data ?? []}
                      onChange={update}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <Select
                value={query.sort ?? "rating_desc"}
                onValueChange={(value) => {
                  if (!value) return;
                  update({ ...query, sort: value as ProductSort, page: undefined });
                }}
              >
                <SelectTrigger aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {products.isLoading ? <ProductGridSkeleton /> : null}
          {products.isError ? (
            <QueryError error={products.error} onRetry={() => void products.refetch()} />
          ) : null}
          {products.data && products.data.items.length === 0 ? (
            <EmptyState
              title="No products match"
              description="Try a broader search, or clear the filters to see the full catalog."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => update(query.q ? { q: query.q } : {})}
                >
                  Clear filters
                </Button>
              }
            />
          ) : null}
          {products.data && products.data.items.length > 0 ? (
            <div
              className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${products.isPlaceholderData ? "opacity-70" : ""}`}
            >
              {products.data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
          {products.data && total > limit ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1 || products.isFetching}
                onClick={() => update({ ...query, page: page - 1 })}
              >
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {page} of {pageCount}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={page >= pageCount || products.isFetching}
                onClick={() => update({ ...query, page: page + 1 })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
