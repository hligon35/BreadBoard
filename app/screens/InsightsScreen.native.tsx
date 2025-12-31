import React, { useEffect } from "react";
import styled from "styled-components/native";
import { BarChart, Card, Container, Donut, H1, H2, Muted, Row, Screen, Scroll } from "@ui/native";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

const Col = styled.View`
  flex-direction: column;
  gap: 10px;
`;

export function InsightsScreen() {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);
  const revenueTrends = useInsightsStore((s) => s.revenueTrends);

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
          <Card>
            <H2>Revenue trends</H2>
            {revenueTrends.length ? <BarChart values={revenueTrends.map((p) => p.value)} /> : null}
            {revenueTrends.map((p) => (
              <Card key={p.month}>
                <Muted>
                  {p.month}: ${p.value.toLocaleString()}
                </Muted>
              </Card>
            ))}
            {revenueTrends.length === 0 && <Muted>Loading…</Muted>}
          </Card>
          <Card>
            <H2>Profitability</H2>
            <Col style={{ marginTop: 10, gap: 10 }}>
              {overview ? (
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Donut value={overview.profitabilityScore} total={100} />
                  <Col style={{ gap: 6 }}>
                    <Muted>Score: {overview.profitabilityScore}/100</Muted>
                    <Muted>Signal: {overview.revenueTrend}</Muted>
                  </Col>
                </Row>
              ) : (
                <Muted>Loading…</Muted>
              )}
            </Col>
          </Card>
          <Card>
            <H2>Efficiency</H2>
            <Col style={{ marginTop: 10, gap: 10 }}>
              {overview ? (
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Donut value={overview.efficiencyScore} total={100} />
                  <Col style={{ gap: 6 }}>
                    <Muted>Score: {overview.efficiencyScore}/100</Muted>
                    <Muted>Goal: reduce context switching</Muted>
                  </Col>
                </Row>
              ) : (
                <Muted>Loading…</Muted>
              )}
            </Col>
          </Card>
          <Card>
            <H2>AI Mentor</H2>
            <Muted>Placeholder panel (no AI/backend yet)</Muted>
            {overview?.aiSuggestions?.slice(0, 6).map((s) => (
              <Card key={s.id}>
                <Muted>
                  {s.category} • {s.urgency}/{s.impact}
                </Muted>
                <Muted>{s.title}</Muted>
                <Muted>{s.detail}</Muted>
              </Card>
            ))}
            {!overview?.aiSuggestions?.length && <Muted>No suggestions</Muted>}
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
