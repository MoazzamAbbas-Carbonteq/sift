import type { Product } from '../persistence/product.entity.js';
import type { ProductRecord } from '../../domain/product-search.js';

export function toProductRecord(product: Product): ProductRecord {
  const features = [...(product.features ?? [])].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const attributes = [...(product.attributes ?? [])]
    .map((attribute) => ({
      key: attribute.attributeKey,
      stringValue: attribute.stringValue,
      numberValue: attribute.numberValue,
      booleanValue: attribute.booleanValue,
    }))
    .sort((left, right) => {
      const byKey = left.key.localeCompare(right.key);
      if (byKey !== 0) {
        return byKey;
      }

      return displayValue(left).localeCompare(displayValue(right));
    });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    description: product.description,
    priceCents: product.priceCents,
    rating: product.rating,
    reviewCount: product.reviewCount,
    inStock: product.inStock,
    freeShipping: product.freeShipping,
    returnDays: product.returnDays,
    imageUrl: product.imageUrl,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    features: features.map((feature) => ({
      label: feature.label,
      sortOrder: feature.sortOrder,
    })),
    attributes,
    reviewSummary: product.reviewSummary
      ? {
          positiveThemes: product.reviewSummary.positiveThemes,
          negativeThemes: product.reviewSummary.negativeThemes,
        }
      : null,
  };
}

function displayValue(attribute: {
  stringValue: string | null;
  numberValue: number | null;
  booleanValue: boolean | null;
}): string {
  if (attribute.stringValue !== null) {
    return attribute.stringValue;
  }

  if (attribute.numberValue !== null) {
    return String(attribute.numberValue);
  }

  return String(attribute.booleanValue);
}
