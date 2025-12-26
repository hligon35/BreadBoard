import React, { useEffect } from "react";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function TaxCountdownWidget({
  Text,
  ValueText,
  ProgressRing,
  Meter,
  Row,
  Col,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  ValueText?: React.ComponentType<{ children: React.ReactNode }>;
  ProgressRing?: React.ComponentType<{
    progress: number;
    tone?: "success" | "warning" | "danger";
    children: React.ReactNode;
  }>;
  Meter?: React.ComponentType<{ progress: number; tone?: "success" | "warning" | "danger" }>;
  Row?: React.ComponentType<{ children: React.ReactNode; style?: any }>;
  Col?: React.ComponentType<{ children: React.ReactNode; style?: any }>;
}) {
  const refresh = useComplianceStore((s) => s.refresh);
  const overview = useComplianceStore((s) => s.overview);
  const currency = useUserStore((s) => s.profile.currency);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  if (!overview) return <Text>Loading…</Text>;

  // Countdown ring represents remaining time within a fixed “urgency window”.
  // This avoids guessing filing cadence while still making “shrinks as deadline approaches” feel right.
  const URGENCY_WINDOW_DAYS = 30;
  const remainingRatio = clamp01(overview.daysRemaining / URGENCY_WINDOW_DAYS);

  // Color transitions add emotional clarity: green → yellow → red.
  const tone = remainingRatio <= 0.33 ? "danger" : remainingRatio <= 0.66 ? "warning" : "success";

  const paymentProgress = clamp01(overview.estimatedTaxPaid / Math.max(1, overview.estimatedTaxDue));
  const paymentTone = paymentProgress >= 0.8 ? "success" : paymentProgress >= 0.5 ? "warning" : "danger";

  const Value = ValueText ?? Text;
  const dayLabel = overview.daysRemaining === 1 ? "day" : "days";
  const itemLabel = overview.openItems === 1 ? "item" : "items";

  const canTwoCol = !!Row && !!Col && !!ProgressRing;

  if (canTwoCol) {
    const R = Row!;
    const C = Col!;

    return (
      <R style={{ justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
        <C style={{ flex: 1, minWidth: 0 }}>
          <Text>{overview.nextFilingLabel}</Text>
          <Text>
            {overview.openItems} open {itemLabel}
          </Text>
          <Text>Estimated tax payments</Text>
          <Text>
            {formatCurrency(overview.estimatedTaxPaid, currency)} / {formatCurrency(overview.estimatedTaxDue, currency)}
          </Text>
          {Meter ? <Meter progress={paymentProgress} tone={paymentTone} /> : null}
        </C>

        <ProgressRing progress={remainingRatio} tone={tone}>
          <Value>{overview.daysRemaining}</Value>
          <Text>{dayLabel}</Text>
        </ProgressRing>
      </R>
    );
  }

  return (
    <>
      <Text>{overview.nextFilingLabel}</Text>
      {ProgressRing ? (
        <ProgressRing progress={remainingRatio} tone={tone}>
          <Value>{overview.daysRemaining}</Value>
          <Text>{dayLabel}</Text>
        </ProgressRing>
      ) : (
        <Text>
          {overview.daysRemaining} {dayLabel} remaining
        </Text>
      )}

      <Text>Estimated tax payments</Text>
      <Text>
        {formatCurrency(overview.estimatedTaxPaid, currency)} / {formatCurrency(overview.estimatedTaxDue, currency)}
      </Text>
      {Meter ? <Meter progress={paymentProgress} tone={paymentTone} /> : null}
      <Text>
        {overview.openItems} open {itemLabel}
      </Text>
    </>
  );
}
