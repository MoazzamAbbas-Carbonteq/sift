"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/compare/compare-selection";
import { fetchProduct, productKeys } from "@/lib/api/products";
import { compareHref } from "@/lib/compare";

const TRAY_PATHS = new Set(["/search", "/choose", "/compare"]);

export function CompareTray() {
  const pathname = usePathname();
  const router = useRouter();
  const compare = useCompare();
  const queries = useQueries({
    queries: compare.ids.map((id) => ({
      queryKey: productKeys.detail(id),
      queryFn: () => fetchProduct(id),
    })),
  });
  const visible = compare.ids.length > 0 && TRAY_PATHS.has(pathname);

  if (!visible) {
    return null;
  }

  const ready = compare.ids.length >= 2;

  function remove(id: string) {
    const next = compare.ids.filter((item) => item !== id);
    compare.remove(id);
    if (pathname === "/compare") {
      router.replace(compareHref(next));
    }
  }

  return (
    <>
      <div className="h-24" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <p className="text-sm font-medium">
            {compare.ids.length} of 3 selected
          </p>
          <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
            {compare.ids.map((id, index) => {
              const query = queries[index];
              const name = query?.data?.name ?? (query?.isError ? "Unavailable" : "Loading");
              return (
                <li key={id} className="flex max-w-full items-center gap-1 rounded-lg bg-muted px-2 py-1">
                  <span className="max-w-40 truncate text-sm">{name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={`Remove ${name}`}
                    onClick={() => remove(id)}
                  >
                    Remove
                  </Button>
                </li>
              );
            })}
          </ul>
          {ready ? (
            <Button nativeButton={false} render={<Link href={compareHref(compare.ids)} />}>
              Compare
            </Button>
          ) : (
            <Button type="button" disabled>
              Compare
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
