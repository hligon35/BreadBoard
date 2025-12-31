import React, { useEffect } from "react";
import styled from "styled-components";
import { BarChart, Card, Col, Donut, H1, H2, Muted, Row } from "@ui/web";
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
  const revenueTrends = useInsightsStore((s) => s.revenueTrends);

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
          <Card>
            <H2>Revenue trends</H2>
            <TopSpace>
              {revenueTrends.length ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Period</th>
                      <th style={{ textAlign: "right" }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueTrends.map((p) => (
                      <tr key={p.month}>
                        <td>{p.month}</td>
                        <td style={{ textAlign: "right" }}>${p.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Muted>Loading…</Muted>
              )}
            </TopSpace>
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>AI Mentor</H2>
            <Muted>Placeholder panel (no AI/backend yet)</Muted>
            <TopSpace>
              {overview?.aiSuggestions?.length ? (
                <Col style={{ gap: 8 }}>
                  {overview.aiSuggestions.slice(0, 6).map((s) => (
                    <Card key={s.id}>
                      <Muted>
                        {s.category} • {s.urgency}/{s.impact}
                      </Muted>
                      <Muted>{s.title}</Muted>
                      <Muted>{s.detail}</Muted>
                    </Card>
                  ))}
                </Col>
              ) : (
                <Muted>No suggestions</Muted>
              )}
            </TopSpace>
          </Card>
        </Flex>
      </Row>

      <Row style={{ alignItems: "stretch" }}>
        <Flex $flex={1}>
          <Card>
            <H2>Profitability</H2>
            <TopSpace>
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
            </TopSpace>
            <TopSpace>
              {revenueTrends.length ? (
                <BarChart values={revenueTrends.map((p) => p.value)} />
              ) : (
                <Muted>Loading trend…</Muted>
              )}
            </TopSpace>
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Efficiency</H2>
            <TopSpace>
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
            </TopSpace>
          </Card>
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

