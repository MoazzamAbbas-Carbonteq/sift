import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
