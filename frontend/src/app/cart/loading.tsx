import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
