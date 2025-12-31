import React, { useEffect, useState } from "react";
import { Card, Col, Donut, H1, Muted, Row, Tabs } from "@ui/web";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

const complianceTabs = [
  { key: "overview", label: "Overview" },
  { key: "forms", label: "Tax & Forms" },
  { key: "security", label: "Security & Access" },
  { key: "audit", label: "Audit Log" },
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
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Compliance</H1>
        <Muted>
          {overview
            ? `${overview.nextFilingLabel} • ${overview.daysRemaining} days • ${overview.openItems} open items`
            : "Loading mock compliance..."}
        </Muted>
      </div>
      <Tabs items={complianceTabs} activeKey={tab} onChange={setTab} />
      {tab === "overview" && (
        <Row style={{ alignItems: "stretch" }}>
          <Card style={{ flex: 1 }}>
            <Muted>Forms completion</Muted>
            <div style={{ marginTop: 10 }}>
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
            </div>
          </Card>
          <Card style={{ flex: 1 }}>
            <Muted>Estimated tax paid</Muted>
            <div style={{ marginTop: 10 }}>
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
            </div>
          </Card>
        </Row>
      )}
      {tab === "forms" && (
        <Card>
          <Muted>Tax & forms</Muted>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Form</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Due</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.status}</td>
                  <td>{new Date(f.dueAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>—</td>
                </tr>
              ))}
              {forms.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <Muted>No forms</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "security" && (
        <Card>
          <Muted>Security & access scaffold</Muted>
          <div style={{ marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Role</th>
                  <th style={{ textAlign: "left" }}>Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Owner</td>
                  <td>Billing, presets, exports</td>
                </tr>
                <tr>
                  <td>Admin</td>
                  <td>Manage projects, clients, compliance</td>
                </tr>
                <tr>
                  <td>Viewer</td>
                  <td>Read-only dashboards</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "audit" && (
        <Card>
          <Muted>Audit log</Muted>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Time</th>
                <th style={{ textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.at).toLocaleString()}</td>
                  <td>{e.action}</td>
                </tr>
              ))}
              {auditLog.length === 0 && (
                <tr>
                  <td colSpan={2}>
                    <Muted>No audit events</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </Col>
  );
}
