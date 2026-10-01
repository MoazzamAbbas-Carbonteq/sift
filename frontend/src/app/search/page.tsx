import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { SearchResults } from "@/components/product/search-results";
import { parseProductQuery } from "@/lib/api/products";
import { getQueryClient } from "@/lib/query-client";
import { prefetchCategories } from "@/server/prefetch/categories";
import { prefetchProducts } from "@/server/prefetch/products";

export const metadata = {
  title: "Search",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = parseProductQuery(await searchParams);
  const queryClient = getQueryClient();
  await Promise.all([
    prefetchProducts(queryClient, query),
    prefetchCategories(queryClient),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResults />
      </Suspense>
    </HydrationBoundary>
  );
}
