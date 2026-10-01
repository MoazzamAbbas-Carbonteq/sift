import Link from "next/link";
import { Suspense } from "react";
import { CartLink } from "@/components/layout/cart-link";
import { SearchForm } from "@/components/layout/search-form";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Sift
        </Link>
        <Suspense fallback={<div className="h-8 min-w-0 flex-1" />}>
          <SearchForm id="header-search" />
        </Suspense>
        <nav className="flex items-center gap-1">
          <Link
            href="/orders"
            className="inline-flex h-8 items-center rounded-lg px-2 text-sm font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Orders
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
