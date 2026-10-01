import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { OrderConfirmation } from "@/components/orders/order-confirmation";
import { getQueryClient } from "@/lib/query-client";
import { prefetchOrder } from "@/server/prefetch/orders";

export const metadata = {
  title: "Order",
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await prefetchOrder(queryClient, id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderConfirmation id={id} />
    </HydrationBoundary>
  );
}
