import React, { useEffect, useState } from "react";
import { Card, ChartPlaceholder, Container, H1, Muted, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

const complianceTabs = [
  { key: "overview", label: "Overview" },
  { key: "forms", label: "Forms" },
  { key: "security", label: "Security" },
  { key: "audit", label: "Audit" },
];

export function ComplianceScreen() {
  const refresh = useComplianceStore((s) => s.refresh);
  const overview = useComplianceStore((s) => s.overview);
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
          {tab === "overview" && <ChartPlaceholder title="Compliance overview" />}
          {tab === "forms" && <TablePlaceholder title="Tax & forms" />}
          {tab === "security" && (
            <Card>
              <Muted>Security & access scaffold (placeholder)</Muted>
            </Card>
          )}
          {tab === "audit" && <TablePlaceholder title="Audit log" />}
        </Container>
      </Scroll>
    </Screen>
  );
}
