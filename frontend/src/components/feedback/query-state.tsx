"use client";

import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/format";

export function QueryError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
      <h2 className="text-base font-medium">This didn’t load</h2>
      <p className="text-sm text-muted-foreground">{errorMessage(error)}</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
      <h2 className="text-base font-medium">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
