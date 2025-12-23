import React, { useEffect } from "react";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

export function BadgesWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  return (
    <>
      <Text>Level: {overview?.gamificationLevel ?? "—"}</Text>
      <Text>Badges: Consistent Invoicer (mock)</Text>
      <Text>Streak: 6 days (mock)</Text>
    </>
  );
}
