import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CompareView } from "@/components/compare/compare-view";
import { parseCompareIds } from "@/lib/compare";
import { getQueryClient } from "@/lib/query-client";
import { prefetchProduct } from "@/server/prefetch/products";

export const metadata = {
  title: "Compare",
};

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const ids = parseCompareIds(params.ids);
  const queryClient = getQueryClient();
  await Promise.all(ids.map((id) => prefetchProduct(queryClient, id)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompareView ids={ids} />
    </HydrationBoundary>
  );
}
