"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryKeys, fetchCategories } from "@/lib/api/categories";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: fetchCategories,
  });
}
