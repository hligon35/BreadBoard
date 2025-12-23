import React, { useEffect, useState } from "react";
import { Col, H1, Muted, Tabs, TablePlaceholder, ChartPlaceholder, Card } from "@ui/web";
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
      {tab === "overview" && <ChartPlaceholder title="Compliance overview" />}
      {tab === "forms" && <TablePlaceholder title="Tax & forms" />}
      {tab === "security" && (
        <Card>
          <Muted>Security & access scaffold</Muted>
          <TablePlaceholder title="Roles / devices / access logs (placeholder)" />
        </Card>
      )}
      {tab === "audit" && <TablePlaceholder title="Audit log" />}
    </Col>
  );
}
