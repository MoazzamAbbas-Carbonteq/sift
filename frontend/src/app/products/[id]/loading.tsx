import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
