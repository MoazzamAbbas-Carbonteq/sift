import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CartView } from "@/components/cart/cart-view";
import { getQueryClient } from "@/lib/query-client";
import { prefetchCart } from "@/server/prefetch/cart";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const queryClient = getQueryClient();
  await prefetchCart(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartView />
    </HydrationBoundary>
  );
}
