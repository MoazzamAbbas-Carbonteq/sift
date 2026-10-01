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

const orderDateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

export function formatOrderDate(iso: string): string {
  const parts = orderDateFormat.formatToParts(new Date(iso));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${pick("month")} ${pick("day")}, ${pick("year")}, ${pick("hour")}:${pick("minute")} ${pick("dayPeriod")} ${pick("timeZoneName")}`;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Try again.";
}
