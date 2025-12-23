import React, { useEffect } from "react";
import styled from "styled-components";
import { Card, Col, H1, H2, Muted, Row, ChartPlaceholder, TablePlaceholder } from "@ui/web";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

const Flex = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
`;

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export function InsightsScreen() {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Insights</H1>
        <Muted>
          {overview
            ? `Trend: ${overview.revenueTrend} • Profitability: ${overview.profitabilityScore} • Efficiency: ${overview.efficiencyScore}`
            : "Loading mock insights..."}
        </Muted>
      </div>

      <Row style={{ alignItems: "stretch" }}>
        <Flex $flex={2}>
          <ChartPlaceholder title="Revenue trends" />
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>AI Mentor</H2>
            <Muted>Placeholder panel (no AI/backend yet)</Muted>
            <TablePlaceholder title="Suggested next actions" rows={4} />
          </Card>
        </Flex>
      </Row>

      <Row style={{ alignItems: "stretch" }}>
        <Flex $flex={1}>
          <ChartPlaceholder title="Profitability insights" />
        </Flex>
        <Flex $flex={1}>
          <ChartPlaceholder title="Time vs money efficiency" />
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Gamification</H2>
            <Muted>Progress and badges (mock)</Muted>
            <TopSpace>
              <Muted>Level: {overview?.gamificationLevel ?? "—"}</Muted>
            </TopSpace>
          </Card>
        </Flex>
      </Row>
    </Col>
  );
}

