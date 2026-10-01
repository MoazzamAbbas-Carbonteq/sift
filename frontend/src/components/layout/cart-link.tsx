"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export function CartLink() {
  const cart = useCart();
  const count =
    cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Link
      href="/cart"
      className="inline-flex h-8 items-center gap-2 rounded-lg px-2 text-sm font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      Cart
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground tabular-nums">
        {count}
      </span>
    </Link>
  );
}
