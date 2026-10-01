"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { EmptyState, QueryError } from "@/components/feedback/query-state";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import { useGuidedDiscovery } from "@/hooks/useGuidedDiscovery";
import {
  discoveryHref,
  parseDiscoveryAnswers,
  type DiscoveryAnswers,
  type DiscoveryBudget,
  type DiscoveryPriority,
  type DiscoveryUseCase,
} from "@/lib/api/discovery";

const USE_CASES: { value: DiscoveryUseCase; label: string }[] = [
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work" },
  { value: "gaming", label: "Gaming" },
  { value: "fitness", label: "Fitness" },
];

const PRIORITIES: { value: DiscoveryPriority; label: string }[] = [
  { value: "noise_cancellation", label: "Noise cancellation" },
  { value: "battery", label: "Battery" },
  { value: "lower_price", label: "Lower price" },
];

const BUDGETS: { value: DiscoveryBudget; label: string }[] = [
  { value: "under_100", label: "Under $100" },
  { value: "100_200", label: "$100–$200" },
  { value: "200_plus", label: "$200+" },
];

export function ChooseFlow() {
  const params = useSearchParams();
  const urlAnswers = parseDiscoveryAnswers(params);
  const discovery = useGuidedDiscovery(urlAnswers);
  const formKey = urlAnswers
    ? `${urlAnswers.useCase}:${urlAnswers.priority}:${urlAnswers.budget}`
    : "new";

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Help me choose"
        description="Three questions about headphones. Matches come from catalog attributes and price."
      />
      <ChooseForm
        key={formKey}
        initialUseCase={urlAnswers?.useCase}
        initialPriority={urlAnswers?.priority}
        initialBudget={urlAnswers?.budget}
        matching={discovery.isFetching}
      />
      <ChooseResults urlAnswers={urlAnswers} discovery={discovery} />
    </div>
  );
}

function ChooseForm({
  initialUseCase,
  initialPriority,
  initialBudget,
  matching,
}: {
  initialUseCase: DiscoveryUseCase | undefined;
  initialPriority: DiscoveryPriority | undefined;
  initialBudget: DiscoveryBudget | undefined;
  matching: boolean;
}) {
  const router = useRouter();
  const [useCase, setUseCase] = useState(initialUseCase);
  const [priority, setPriority] = useState(initialPriority);
  const [budget, setBudget] = useState(initialBudget);
  const ready =
    useCase !== undefined && priority !== undefined && budget !== undefined;

  function seeMatches() {
    if (!useCase || !priority || !budget) {
      return;
    }

    router.push(discoveryHref({ useCase, priority, budget }), { scroll: false });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        seeMatches();
      }}
    >
      <ChoiceGroup
        legend="What are you buying for?"
        name="useCase"
        options={USE_CASES}
        value={useCase}
        onChange={setUseCase}
      />
      <ChoiceGroup
        legend="What matters most?"
        name="priority"
        options={PRIORITIES}
        value={priority}
        onChange={setPriority}
      />
      <ChoiceGroup
        legend="What is your budget?"
        name="budget"
        options={BUDGETS}
        value={budget}
        onChange={setBudget}
      />
      <Button type="submit" disabled={!ready || matching} className="w-fit">
        {matching ? "Matching…" : "See matches"}
      </Button>
    </form>
  );
}

function ChooseResults({
  urlAnswers,
  discovery,
}: {
  urlAnswers: DiscoveryAnswers | null;
  discovery: ReturnType<typeof useGuidedDiscovery>;
}) {
  if (!urlAnswers) {
    return (
      <p className="text-sm text-muted-foreground">
        Answer all three questions to see matches.
      </p>
    );
  }

  if (discovery.isLoading) {
    return <ProductGridSkeleton count={4} />;
  }

  if (discovery.isError) {
    return (
      <QueryError error={discovery.error} onRetry={() => void discovery.refetch()} />
    );
  }

  if (discovery.data && discovery.data.matches.length === 0) {
    return (
      <EmptyState
        title="No headphones match"
        description="Those answers do not match a headphone in the catalog. Try another use, priority, or budget."
      />
    );
  }

  if (!discovery.data) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Matches</h2>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {discovery.data.matches.map((match) => (
          <li key={match.product.id} className="flex flex-col gap-2">
            <p className="text-sm">{match.reason}</p>
            <ProductCard product={match.product} showCompare />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-base font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              name={name}
              variant={selected ? "default" : "outline"}
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}
