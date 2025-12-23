import React, { useEffect } from "react";
import { useWorkStore } from "@app/context/stores/useWorkStore";

export function ActiveProjectsWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);

  useEffect(() => {
    if (!summary) refresh();
  }, [summary, refresh]);

  if (!summary) return <Text>Loading…</Text>;
  return (
    <>
      <Text>{summary.activeProjects} active projects</Text>
      <Text>{summary.openTasks} open tasks</Text>
      <Text>Next due: {summary.nextDueDate}</Text>
    </>
  );
}
