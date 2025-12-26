import type { KanbanBoard, WorkSummary } from "@app/context/stores/useWorkStore";

export async function getMockWorkSummary(): Promise<WorkSummary> {
  return {
    activeProjects: 6,
    openTasks: 13,
    nextDueDate: "2025-12-29",
  };
}

export async function getMockKanbanBoard(): Promise<KanbanBoard> {
  return {
    columns: [
      {
        key: "todo",
        title: "To do",
        cards: [
          { id: "k1", title: "Send proposal v2", meta: "Acme Co", progress: 0.2, deadline: "2025-12-29", avatar: "AC" },
          { id: "k2", title: "Draft invoice template", meta: "Ops", progress: 0.35, deadline: "2026-01-03", avatar: "OP" },
          { id: "k5", title: "Refresh brand deck", meta: "Sponsor", progress: 0.1, deadline: "2026-01-06", avatar: "SB" },
        ],
      },
      {
        key: "doing",
        title: "Doing",
        cards: [
          { id: "k3", title: "Build dashboard widgets", meta: "Bread Board", progress: 0.55, deadline: "2025-12-27", avatar: "BB" },
          { id: "k6", title: "Trello sync setup", meta: "Integration", progress: 0.45, deadline: "2025-12-26", avatar: "TR" },
        ],
      },
      {
        key: "done",
        title: "Done",
        cards: [{ id: "k4", title: "Year-end reconciliation", meta: "Money", progress: 1, deadline: "2025-12-22", avatar: "MO" }],
      },
    ],
  };
}

export async function getMockTasks() {
  return [
    { id: "t1", title: "Follow up: Northwind", due: "2025-12-23", status: "open" },
    { id: "t2", title: "Prep January tax packet", due: "2025-12-28", status: "open" },
    { id: "t3", title: "Update portfolio", due: "2026-01-05", status: "blocked" },
  ];
}

export async function getMockCalendarEvents() {
  return [
    { id: "e1", title: "Client call (Acme)", start: "2025-12-23T10:00:00" },
    { id: "e2", title: "Invoice run", start: "2025-12-27T09:00:00" },
  ];
}

export async function getMockCashFlowForecast() {
  return {
    next30Days: {
      expectedIncome: 9200,
      expectedExpenses: 2100,
      projectedNet: 7100,
    },
  };
}
