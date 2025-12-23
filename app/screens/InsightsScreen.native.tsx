import React, { useEffect } from "react";
import { Card, ChartPlaceholder, Container, H1, H2, Muted, Screen, Scroll, TablePlaceholder } from "@ui/native";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

export function InsightsScreen() {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Insights</H1>
          <Card>
            <Muted>
              {overview
                ? `Trend: ${overview.revenueTrend} • Profitability: ${overview.profitabilityScore} • Efficiency: ${overview.efficiencyScore}`
                : "Loading mock insights..."}
            </Muted>
          </Card>
          <ChartPlaceholder title="Revenue trends" />
          <ChartPlaceholder title="Profitability insights" />
          <ChartPlaceholder title="Time vs money" />
          <Card>
            <H2>AI Mentor</H2>
            <Muted>Placeholder panel (no AI/backend yet)</Muted>
            <TablePlaceholder title="Suggested actions" />
          </Card>
          <Card>
            <H2>Gamification</H2>
            <Muted>Level: {overview?.gamificationLevel ?? "—"}</Muted>
          </Card>
        </Container>
      </Scroll>
    </Screen>
  );
}
