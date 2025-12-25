import React, { useEffect } from "react";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function TaxCountdownWidget({
  Text,
  ValueText,
  ProgressRing,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  ValueText?: React.ComponentType<{ children: React.ReactNode }>;
  ProgressRing?: React.ComponentType<{ progress: number; children: React.ReactNode }>;
}) {
  const refresh = useComplianceStore((s) => s.refresh);
  const overview = useComplianceStore((s) => s.overview);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  if (!overview) return <Text>Loading…</Text>;

  // Countdown ring represents remaining time within a fixed “urgency window”.
  // This avoids guessing filing cadence while still making “shrinks as deadline approaches” feel right.
  const URGENCY_WINDOW_DAYS = 30;
  const remainingRatio = clamp01(overview.daysRemaining / URGENCY_WINDOW_DAYS);

  const Value = ValueText ?? Text;

  return (
    <>
      <Text>{overview.nextFilingLabel}</Text>
      {ProgressRing ? (
        <ProgressRing progress={remainingRatio}>
          <Value>{overview.daysRemaining}</Value>
          <Text>days</Text>
        </ProgressRing>
      ) : (
        <Text>{overview.daysRemaining} days remaining</Text>
      )}
      <Text>{overview.openItems} open items</Text>
    </>
  );
}
