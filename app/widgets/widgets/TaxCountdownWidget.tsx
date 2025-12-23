import React, { useEffect } from "react";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

export function TaxCountdownWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const refresh = useComplianceStore((s) => s.refresh);
  const overview = useComplianceStore((s) => s.overview);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  if (!overview) return <Text>Loading…</Text>;
  return (
    <>
      <Text>{overview.nextFilingLabel}</Text>
      <Text>{overview.daysRemaining} days remaining</Text>
      <Text>{overview.openItems} open items</Text>
    </>
  );
}
