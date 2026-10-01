import type { QueryClient } from "@tanstack/react-query";
import {
  discoveryKeys,
  matchDiscovery,
  type DiscoveryAnswers,
} from "@/lib/api/discovery";

export function prefetchDiscovery(
  queryClient: QueryClient,
  answers: DiscoveryAnswers,
) {
  return queryClient.prefetchQuery({
    queryKey: discoveryKeys.match(answers),
    queryFn: () => matchDiscovery(answers),
  });
}
