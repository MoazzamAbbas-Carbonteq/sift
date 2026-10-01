const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const MAX_COMPARE = 3;

export function parseCompareIds(
  value: string | string[] | undefined,
): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => UUID.test(id));

  return [...new Set(ids)].slice(0, MAX_COMPARE);
}

export function compareHref(ids: string[]): string {
  if (ids.length === 0) {
    return "/compare";
  }

  return `/compare?ids=${ids.map((id) => encodeURIComponent(id)).join(",")}`;
}
