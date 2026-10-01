"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MAX_COMPARE } from "@/lib/compare";

type CompareSelection = {
  ids: string[];
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  replace: (ids: string[]) => void;
};

const CompareSelectionContext = createContext<CompareSelection | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const add = useCallback((id: string) => {
    setIds((current) => {
      if (current.includes(id) || current.length >= MAX_COMPARE) {
        return current;
      }

      return [...current, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setIds((current) => current.filter((item) => item !== id));
  }, []);

  const replace = useCallback((next: string[]) => {
    setIds((current) => {
      const normalized = [...new Set(next)].slice(0, MAX_COMPARE);
      if (
        current.length === normalized.length &&
        current.every((id, index) => id === normalized[index])
      ) {
        return current;
      }

      return normalized;
    });
  }, []);

  const value = useMemo<CompareSelection>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      add,
      remove,
      replace,
    }),
    [add, ids, remove, replace],
  );

  return (
    <CompareSelectionContext.Provider value={value}>
      {children}
    </CompareSelectionContext.Provider>
  );
}

export function useCompare(): CompareSelection {
  const value = useContext(CompareSelectionContext);
  if (!value) {
    throw new Error("useCompare must be used within CompareProvider");
  }

  return value;
}
