"use client";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button type="button" variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
