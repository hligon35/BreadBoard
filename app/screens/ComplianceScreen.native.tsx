import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Card, Container, Donut, H1, Muted, Row, Screen, Scroll, Tabs } from "@ui/native";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

const Col = styled.View`
  flex-direction: column;
  gap: 10px;
`;

const complianceTabs = [
  { key: "overview", label: "Overview" },
  { key: "forms", label: "Forms" },
  { key: "security", label: "Security" },
  { key: "audit", label: "Audit" },
];

export function ComplianceScreen() {
  const refresh = useComplianceStore((s) => s.refresh);
  const overview = useComplianceStore((s) => s.overview);
  const forms = useComplianceStore((s) => s.forms);
  const auditLog = useComplianceStore((s) => s.auditLog);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Compliance</H1>
          <Card>
            <Muted>
              {overview
                ? `${overview.nextFilingLabel} • ${overview.daysRemaining} days • ${overview.openItems} open items`
                : "Loading mock compliance..."}
            </Muted>
          </Card>
          <Tabs items={complianceTabs} activeKey={tab} onChange={setTab} />
          {tab === "overview" && (
            <Row style={{ alignItems: "stretch" }}>
              <Card style={{ flex: 1 }}>
                <Muted>Forms completion</Muted>
                <Col style={{ marginTop: 10, gap: 10 }}>
                  {(() => {
                    const total = Math.max(1, forms.length);
                    const complete = forms.filter((f) => f.status === "complete").length;
                    return (
                      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Donut value={complete} total={total} />
                        <Col style={{ gap: 6 }}>
                          <Muted>Complete: {complete}</Muted>
                          <Muted>Remaining: {Math.max(0, total - complete)}</Muted>
                        </Col>
                      </Row>
                    );
                  })()}
                </Col>
              </Card>
              <Card style={{ flex: 1 }}>
                <Muted>Estimated tax paid</Muted>
                <Col style={{ marginTop: 10, gap: 10 }}>
                  {overview ? (
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Donut value={overview.estimatedTaxPaid} total={Math.max(1, overview.estimatedTaxDue)} />
                      <Col style={{ gap: 6 }}>
                        <Muted>Due: ${overview.estimatedTaxDue.toLocaleString()}</Muted>
                        <Muted>Paid: ${overview.estimatedTaxPaid.toLocaleString()}</Muted>
                      </Col>
                    </Row>
                  ) : (
                    <Muted>Loading…</Muted>
                  )}
                </Col>
              </Card>
            </Row>
          )}
          {tab === "forms" && (
            <Card>
              <Muted>Tax & forms</Muted>
              {forms.map((f) => (
                <Card key={f.id}>
                  <Muted>
                    {f.name} • {f.status.toUpperCase()} • due {new Date(f.dueAt).toLocaleDateString()}
                  </Muted>
                </Card>
              ))}
              {forms.length === 0 && <Muted>No forms</Muted>}
            </Card>
          )}
          {tab === "security" && (
            <Card>
              <Muted>Security & access</Muted>
              <Col style={{ marginTop: 10, gap: 8 }}>
                <Muted>Owner — Billing, presets, exports</Muted>
                <Muted>Admin — Manage projects, clients, compliance</Muted>
                <Muted>Viewer — Read-only dashboards</Muted>
              </Col>
            </Card>
          )}
          {tab === "audit" && (
            <Card>
              <Muted>Audit log</Muted>
              {auditLog.map((e) => (
                <Card key={e.id}>
                  <Muted>
                    {new Date(e.at).toLocaleString()} • {e.action}
                  </Muted>
                </Card>
              ))}
              {auditLog.length === 0 && <Muted>No audit events</Muted>}
            </Card>
          )}
        </Container>
      </Scroll>
    </Screen>
  );
}
