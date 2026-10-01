"use client";

import { useQuery } from "@tanstack/react-query";
import {
  discoveryKeys,
  matchDiscovery,
  type DiscoveryAnswers,
} from "@/lib/api/discovery";

export function useGuidedDiscovery(answers: DiscoveryAnswers | null) {
  return useQuery({
    queryKey: answers
      ? discoveryKeys.match(answers)
      : ([...discoveryKeys.all, "pending"] as const),
    queryFn: () => {
      if (!answers) {
        throw new Error("Discovery answers are required");
      }

      return matchDiscovery(answers);
    },
    enabled: answers !== null,
  });
}
