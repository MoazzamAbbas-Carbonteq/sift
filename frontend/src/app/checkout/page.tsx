import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getQueryClient } from "@/lib/query-client";
import { prefetchCart } from "@/server/prefetch/cart";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const queryClient = getQueryClient();
  await prefetchCart(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutForm />
    </HydrationBoundary>
  );
}
