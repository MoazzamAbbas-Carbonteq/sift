export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Try again.";
}
