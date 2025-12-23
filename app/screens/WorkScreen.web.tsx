import React, { useEffect, useState } from "react";
import { Col, H1, Muted, Tabs, ChartPlaceholder, TablePlaceholder, Card } from "@ui/web";
import { useWorkStore } from "@app/context/stores/useWorkStore";

const workTabs = [
  { key: "projects", label: "Projects (Kanban)" },
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "forecast", label: "Cash Flow Forecast" },
];

export function WorkScreen() {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Work</H1>
        <Muted>
          {summary
            ? `Active projects: ${summary.activeProjects} • Open tasks: ${summary.openTasks}`
            : "Loading mock data..."}
        </Muted>
      </div>

      <Tabs items={workTabs} activeKey={tab} onChange={setTab} />

      {tab === "projects" && (
        <Card>
          <Muted>Kanban placeholder</Muted>
          <TablePlaceholder title="Kanban columns/cards" />
        </Card>
      )}
      {tab === "tasks" && <TablePlaceholder title="Task list" />}
      {tab === "calendar" && <ChartPlaceholder title="Calendar placeholder" />}
      {tab === "forecast" && <ChartPlaceholder title="Cash flow forecast" />}
    </Col>
  );
}
