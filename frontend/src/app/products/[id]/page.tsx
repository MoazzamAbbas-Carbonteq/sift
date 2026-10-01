import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductDetail } from "@/components/product/product-detail";
import { fetchProduct } from "@/lib/api/products";
import { getQueryClient } from "@/lib/query-client";
import { prefetchProduct } from "@/server/prefetch/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);
    return { title: product.name };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await prefetchProduct(queryClient, id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetail id={id} />
    </HydrationBoundary>
  );
}
