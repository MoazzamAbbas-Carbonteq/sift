export type AttributeValue = {
  key: string;
  stringValue: string | null;
  numberValue: number | null;
  booleanValue: boolean | null;
};

export type CatalogFact = {
  key: string;
  label: string;
  value: string;
};

const ATTRIBUTE_ORDER = [
  "noise_cancellation",
  "battery_hours",
  "form_factor",
  "weight_grams",
  "bluetooth_version",
  "multipoint",
  "ram_gb",
  "storage_gb",
  "screen_inches",
  "weight_kg",
  "battery_mah",
  "resolution",
  "refresh_rate_hz",
  "panel",
  "switch_type",
  "layout",
  "wireless",
] as const;

const LABELS: Record<string, string> = {
  noise_cancellation: "Noise cancellation",
  battery_hours: "Battery",
  form_factor: "Form",
  weight_grams: "Weight",
  bluetooth_version: "Bluetooth",
  multipoint: "Multipoint",
  ram_gb: "Memory",
  storage_gb: "Storage",
  screen_inches: "Screen",
  weight_kg: "Weight",
  battery_mah: "Battery",
  resolution: "Resolution",
  refresh_rate_hz: "Refresh rate",
  panel: "Panel",
  switch_type: "Switch",
  layout: "Layout",
  wireless: "Wireless",
};

const STRING_VALUES: Record<string, string> = {
  over_ear: "Over-ear",
  in_ear: "In-ear",
  on_ear: "On-ear",
  seventy_five: "75%",
  sixty_five: "65%",
  full: "Full",
  low_profile: "Low profile",
};

export function listCatalogFacts(
  attributes: AttributeValue[],
  limit: number,
): CatalogFact[] {
  const byKey = new Map(attributes.map((attribute) => [attribute.key, attribute]));
  const extraKeys = attributes
    .map((attribute) => attribute.key)
    .filter((key) => !ATTRIBUTE_ORDER.some((ordered) => ordered === key))
    .sort();
  const keys = [
    ...ATTRIBUTE_ORDER.filter((key) => byKey.has(key)),
    ...extraKeys,
  ];
  const facts: CatalogFact[] = [];

  for (const key of keys) {
    const value = formatAttribute(byKey.get(key));
    if (!value) {
      continue;
    }

    facts.push({ key, label: attributeLabel(key), value });
    if (facts.length === limit) {
      break;
    }
  }

  return facts;
}

export function sharedAttributeKeys(
  products: { attributes: AttributeValue[] }[],
  limit: number,
): string[] {
  return ATTRIBUTE_ORDER.filter((key) =>
    products.some((product) => formatAttribute(findAttribute(product.attributes, key)) !== null),
  ).slice(0, limit);
}

export function formatAttribute(attribute: AttributeValue | undefined): string | null {
  if (!attribute) {
    return null;
  }

  if (attribute.booleanValue !== null) {
    return attribute.booleanValue ? "Yes" : "No";
  }

  if (attribute.numberValue !== null) {
    return formatNumber(attribute.key, attribute.numberValue);
  }

  if (attribute.stringValue !== null) {
    return STRING_VALUES[attribute.stringValue] ?? humanize(attribute.stringValue);
  }

  return null;
}

export function attributeLabel(key: string): string {
  return LABELS[key] ?? humanize(key);
}

export function findAttribute(
  attributes: AttributeValue[],
  key: string,
): AttributeValue | undefined {
  return attributes.find((attribute) => attribute.key === key);
}

function formatNumber(key: string, value: number): string {
  const amount = Number.isInteger(value) ? String(value) : String(value);

  switch (key) {
    case "battery_hours":
      return `${amount} hours`;
    case "weight_grams":
      return `${amount} g`;
    case "weight_kg":
      return `${amount} kg`;
    case "screen_inches":
      return `${amount} in`;
    case "ram_gb":
    case "storage_gb":
      return `${amount} GB`;
    case "battery_mah":
      return `${amount} mAh`;
    case "refresh_rate_hz":
      return `${amount} Hz`;
    default:
      return amount;
  }
}

function humanize(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
