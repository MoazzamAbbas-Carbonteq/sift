"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm({
  id,
  inputClassName,
}: {
  id: string;
  inputClassName?: string;
}) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  return (
    <form action="/search" className="flex min-w-0 flex-1 gap-2">
      <label className="sr-only" htmlFor={id}>
        Search products
      </label>
      <Input
        id={id}
        name="q"
        key={query}
        defaultValue={query}
        placeholder="Search products"
        className={inputClassName}
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
