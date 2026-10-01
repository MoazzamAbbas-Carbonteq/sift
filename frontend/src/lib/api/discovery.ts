import { apiFetch } from "./client";
import type { ProductSummary } from "./products";

export const DISCOVERY_USE_CASES = [
  "travel",
  "work",
  "gaming",
  "fitness",
] as const;

export const DISCOVERY_PRIORITIES = [
  "noise_cancellation",
  "battery",
  "lower_price",
] as const;

export const DISCOVERY_BUDGETS = ["under_100", "100_200", "200_plus"] as const;

export type DiscoveryUseCase = (typeof DISCOVERY_USE_CASES)[number];
export type DiscoveryPriority = (typeof DISCOVERY_PRIORITIES)[number];
export type DiscoveryBudget = (typeof DISCOVERY_BUDGETS)[number];

export type DiscoveryAnswers = {
  useCase: DiscoveryUseCase;
  priority: DiscoveryPriority;
  budget: DiscoveryBudget;
};

export type DiscoveryMatch = {
  product: ProductSummary;
  reason: string;
};

export type DiscoveryResult = {
  matches: DiscoveryMatch[];
};

type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export const discoveryKeys = {
  all: ["discovery"] as const,
  match: (answers: DiscoveryAnswers) =>
    [
      "discovery",
      "match",
      answers.useCase,
      answers.priority,
      answers.budget,
    ] as const,
};

export function matchDiscovery(
  answers: DiscoveryAnswers,
): Promise<DiscoveryResult> {
  return apiFetch<DiscoveryResult>("/discovery/match", {
    method: "POST",
    body: JSON.stringify(answers),
  });
}

export function parseDiscoveryAnswers(
  source: SearchParamSource,
): DiscoveryAnswers | null {
  const useCase = readUseCase(readOne(source, "useCase"));
  const priority = readPriority(readOne(source, "priority"));
  const budget = readBudget(readOne(source, "budget"));
  if (!useCase || !priority || !budget) {
    return null;
  }

  return { useCase, priority, budget };
}

export function discoveryHref(answers: DiscoveryAnswers): string {
  const params = new URLSearchParams({
    useCase: answers.useCase,
    priority: answers.priority,
    budget: answers.budget,
  });
  return `/choose?${params.toString()}`;
}

function readOne(source: SearchParamSource, key: string): string | undefined {
  const value =
    source instanceof URLSearchParams ? source.get(key) : source[key];
  const first = Array.isArray(value) ? value[0] : value;
  return first || undefined;
}

function readUseCase(value: string | undefined): DiscoveryUseCase | undefined {
  return DISCOVERY_USE_CASES.find((useCase) => useCase === value);
}

function readPriority(value: string | undefined): DiscoveryPriority | undefined {
  return DISCOVERY_PRIORITIES.find((priority) => priority === value);
}

function readBudget(value: string | undefined): DiscoveryBudget | undefined {
  return DISCOVERY_BUDGETS.find((budget) => budget === value);
}
