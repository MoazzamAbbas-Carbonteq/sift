import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { OrderHistory } from "@/components/orders/order-history";
import { getQueryClient } from "@/lib/query-client";
import { prefetchOrders } from "@/server/prefetch/orders";

export const metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  const queryClient = getQueryClient();
  await prefetchOrders(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderHistory />
    </HydrationBoundary>
  );
}
