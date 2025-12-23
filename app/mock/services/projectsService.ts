import type { WorkSummary } from "@app/context/stores/useWorkStore";

export async function getMockWorkSummary(): Promise<WorkSummary> {
  return {
    activeProjects: 4,
    openTasks: 13,
    nextDueDate: "2025-12-29",
  };
}

export async function getMockKanbanBoard() {
  return {
    columns: [
      {
        key: "todo",
        title: "To do",
        cards: [
          { id: "k1", title: "Send proposal v2", meta: "Acme Co" },
          { id: "k2", title: "Draft invoice template", meta: "Ops" },
        ],
      },
      {
        key: "doing",
        title: "In progress",
        cards: [{ id: "k3", title: "Build dashboard widgets", meta: "Bread Board" }],
      },
      {
        key: "done",
        title: "Done",
        cards: [{ id: "k4", title: "Year-end reconciliation", meta: "Money" }],
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
