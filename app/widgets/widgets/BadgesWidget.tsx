import React, { useEffect } from "react";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

export function BadgesWidget({
  Text,
  StrongText,
  ProgressRing,
  BadgeShelf,
  BadgePill,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  ProgressRing?: React.ComponentType<{ progress: number; children: React.ReactNode }>;
  BadgeShelf?: React.ComponentType<{ children: React.ReactNode }>;
  BadgePill?: React.ComponentType<{ label: string }>;
}) {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  const Strong = StrongText ?? Text;
  const pct = overview ? Math.round(Math.max(0, Math.min(1, overview.nextBadgeProgress)) * 100) : 0;

  return (
    <>
      <Text>Level: {overview?.gamificationLevel ?? "—"}</Text>

      {overview && ProgressRing ? (
        <ProgressRing progress={overview.nextBadgeProgress}>
          <Strong>{pct}%</Strong>
          <Text>to {overview.nextBadgeLabel}</Text>
        </ProgressRing>
      ) : (
        <Text>Progress: {overview ? `${pct}%` : "—"}</Text>
      )}

      {overview && BadgeShelf && BadgePill ? (
        <BadgeShelf>
          {overview.earnedBadges.slice(0, 8).map((b) => (
            <BadgePill key={b} label={b} />
          ))}
        </BadgeShelf>
      ) : (
        <Text>Badges: {overview?.earnedBadges?.[0] ?? "—"}</Text>
      )}
    </>
  );
}
