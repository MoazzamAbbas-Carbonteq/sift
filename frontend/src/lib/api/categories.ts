import { apiFetch } from "./client";
import type { Category } from "./products";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}
