import React, { useEffect, useState } from "react";
import { Card, ChartPlaceholder, Container, H1, Muted, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useWorkStore } from "@app/context/stores/useWorkStore";

const workTabs = [
  { key: "projects", label: "Projects" },
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "forecast", label: "Forecast" },
];

export function WorkScreen() {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Work</H1>
          <Card>
            <Muted>
              {summary
                ? `Active projects: ${summary.activeProjects} • Open tasks: ${summary.openTasks}`
                : "Loading mock data..."}
            </Muted>
          </Card>
          <Tabs items={workTabs} activeKey={tab} onChange={setTab} />
          {tab === "projects" && <TablePlaceholder title="Kanban placeholder" />}
          {tab === "tasks" && <TablePlaceholder title="Tasks placeholder" />}
          {tab === "calendar" && <ChartPlaceholder title="Calendar placeholder" />}
          {tab === "forecast" && <ChartPlaceholder title="Cash flow forecast" />}
        </Container>
      </Scroll>
    </Screen>
  );
}
