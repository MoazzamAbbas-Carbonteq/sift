import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { HomeContent } from "@/components/home/home-content";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { featuredProductQuery } from "@/lib/api/products";
import { getQueryClient } from "@/lib/query-client";
import { prefetchCategories } from "@/server/prefetch/categories";
import { prefetchProducts } from "@/server/prefetch/products";

export default async function HomePage() {
  const queryClient = getQueryClient();
  await Promise.all([
    prefetchProducts(queryClient, featuredProductQuery),
    prefetchCategories(queryClient),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductGridSkeleton />}>
        <HomeContent />
      </Suspense>
    </HydrationBoundary>
  );
}
