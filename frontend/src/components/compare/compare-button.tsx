"use client";

import { useCompare } from "@/components/compare/compare-selection";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE } from "@/lib/compare";
import { cn } from "@/lib/utils";

export function CompareButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const compare = useCompare();
  const selected = compare.has(productId);
  const blocked = !selected && compare.ids.length >= MAX_COMPARE;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("min-w-28", className)}
      disabled={blocked}
      aria-pressed={selected}
      onClick={() => (selected ? compare.remove(productId) : compare.add(productId))}
    >
      {selected ? "Comparing" : blocked ? "3 products max" : "Compare"}
    </Button>
  );
}
