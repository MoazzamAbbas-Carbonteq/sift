import type { ProductRecord } from '../../products/domain/product-search.js';

export const DISCOVERY_USE_CASES = ['travel', 'work', 'gaming', 'fitness'] as const;
export const DISCOVERY_PRIORITIES = ['noise_cancellation', 'battery', 'lower_price'] as const;
export const DISCOVERY_BUDGETS = ['under_100', '100_200', '200_plus'] as const;

export type DiscoveryUseCase = (typeof DISCOVERY_USE_CASES)[number];
export type DiscoveryPriority = (typeof DISCOVERY_PRIORITIES)[number];
export type DiscoveryBudget = (typeof DISCOVERY_BUDGETS)[number];

export type DiscoveryAnswers = {
  useCase: DiscoveryUseCase;
  priority: DiscoveryPriority;
  budget: DiscoveryBudget;
};

export type HeadphoneMatch = {
  product: ProductRecord;
  reason: string;
};

const MATCH_LIMIT = 4;
const MIN_BATTERY_HOURS = 20;

export function matchHeadphones(
  products: ProductRecord[],
  answers: DiscoveryAnswers,
): HeadphoneMatch[] {
  const forUse = products.filter((product) => hasUseCase(product, answers.useCase));
  const inBudget = forUse.filter((product) => matchesBudget(product.priceCents, answers.budget));
  const ranked = rank(inBudget, answers.priority).slice(0, MATCH_LIMIT);

  return ranked.map((product) => ({
    product,
    reason: matchReason(product, answers),
  }));
}

function matchesBudget(priceCents: number, budget: DiscoveryBudget): boolean {
  if (budget === 'under_100') {
    return priceCents < 10000;
  }

  if (budget === '100_200') {
    return priceCents >= 10000 && priceCents <= 20000;
  }

  return priceCents > 20000;
}

function rank(products: ProductRecord[], priority: DiscoveryPriority): ProductRecord[] {
  if (priority === 'noise_cancellation') {
    return products
      .filter((product) => booleanAttribute(product, 'noise_cancellation') === true)
      .sort(byRating);
  }

  if (priority === 'battery') {
    return products
      .filter((product) => {
        const hours = numberAttribute(product, 'battery_hours');
        return hours !== null && hours >= MIN_BATTERY_HOURS;
      })
      .sort((left, right) => {
        const rightHours = numberAttribute(right, 'battery_hours') ?? 0;
        const leftHours = numberAttribute(left, 'battery_hours') ?? 0;
        if (rightHours !== leftHours) {
          return rightHours - leftHours;
        }

        return byRating(left, right);
      });
  }

  return [...products].sort((left, right) => {
    if (left.priceCents !== right.priceCents) {
      return left.priceCents - right.priceCents;
    }

    return byRating(left, right);
  });
}

function hasUseCase(product: ProductRecord, useCase: DiscoveryUseCase): boolean {
  return product.attributes.some(
    (attribute) => attribute.key === 'use_case' && attribute.stringValue === useCase,
  );
}

function matchReason(product: ProductRecord, answers: DiscoveryAnswers): string {
  const price = formatPrice(product.priceCents);
  const budget = budgetLabel(answers.budget);
  const listed = `Listed for ${answers.useCase}. `;

  if (answers.priority === 'noise_cancellation') {
    return `${listed}Noise cancellation is listed as yes. Price is ${price}, inside the ${budget} budget.`;
  }

  if (answers.priority === 'battery') {
    const hours = numberAttribute(product, 'battery_hours') ?? 0;
    return `${listed}${formatHours(hours)} battery. Price is ${price}, inside the ${budget} budget.`;
  }

  return `${listed}Price is ${price}, among the lower prices in the ${budget} range.`;
}

function budgetLabel(budget: DiscoveryBudget): string {
  if (budget === 'under_100') {
    return 'under $100';
  }

  if (budget === '100_200') {
    return '$100–$200';
  }

  return '$200+';
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatHours(hours: number): string {
  const label = Number.isInteger(hours) ? String(hours) : String(hours);
  return `${label}-hour`;
}

function byRating(left: ProductRecord, right: ProductRecord): number {
  if (right.rating !== left.rating) {
    return right.rating - left.rating;
  }

  if (right.reviewCount !== left.reviewCount) {
    return right.reviewCount - left.reviewCount;
  }

  return left.id.localeCompare(right.id);
}

function booleanAttribute(product: ProductRecord, key: string): boolean | null {
  const attribute = product.attributes.find((item) => item.key === key);
  return attribute?.booleanValue ?? null;
}

function numberAttribute(product: ProductRecord, key: string): number | null {
  const attribute = product.attributes.find((item) => item.key === key);
  return attribute?.numberValue ?? null;
}
