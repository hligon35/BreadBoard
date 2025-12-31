import type { KanbanBoard, WorkSummary } from "@app/context/stores/useWorkStore";
import { mockDb } from "@app/mock/data/mockDb";

export async function getMockWorkSummary(): Promise<WorkSummary> {
  const activeProjects = mockDb.projects.filter((p) => p.status !== "done").length;
  const openTasks = mockDb.tasks.filter((t) => t.status === "open" || t.status === "blocked").length;
  const next = mockDb.tasks
    .filter((t) => t.status !== "done")
    .slice()
    .sort((a, b) => (a.due > b.due ? 1 : -1))[0];

  return {
    activeProjects,
    openTasks,
    nextDueDate: next?.due ?? new Date().toISOString().slice(0, 10),
  };
}

export async function getMockKanbanBoard(): Promise<KanbanBoard> {
  const nameById = new Map(mockDb.clients.map((c) => [c.id, c.name] as const));
  const initials = (name: string) =>
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0] ?? "")
      .join("")
      .toUpperCase();

  const toCard = (p: (typeof mockDb.projects)[number]) => {
    const clientName = nameById.get(p.clientId) ?? p.clientId;
    return {
      id: p.id,
      title: p.title.split(" • ")[1] ?? p.title,
      meta: clientName,
      progress: p.progress,
      deadline: p.deadline,
      avatar: initials(clientName),
    };
  };

  const todo = mockDb.projects.filter((p) => p.status === "todo").map(toCard);
  const doing = mockDb.projects.filter((p) => p.status === "doing").map(toCard);
  const done = mockDb.projects.filter((p) => p.status === "done").map(toCard);

  return {
    columns: [
      { key: "todo", title: "To do", cards: todo },
      { key: "doing", title: "Doing", cards: doing },
      { key: "done", title: "Done", cards: done },
    ],
  };
}

export async function getMockTasks() {
  const nameById = new Map(mockDb.clients.map((c) => [c.id, c.name] as const));
  return mockDb.tasks
    .slice()
    .sort((a, b) => (a.due > b.due ? 1 : -1))
    .map((t) => ({
      id: t.id,
      title: t.title,
      due: t.due,
      status: t.status,
      clientId: t.clientId,
      client: t.clientId ? nameById.get(t.clientId) ?? t.clientId : undefined,
      projectId: t.projectId,
    }));
}

export async function getMockCalendarEvents() {
  return mockDb.calendarEvents;
}

export async function getMockCashFlowForecast() {
  // Simple aggregation based on last N cashFlow points.
  const points = mockDb.cashFlow.slice(-4);
  const expectedIncome = points.reduce((s, p) => s + p.inflow, 0);
  const expectedExpenses = points.reduce((s, p) => s + p.outflow, 0);
  const projectedNet = expectedIncome - expectedExpenses;
  return { next30Days: { expectedIncome, expectedExpenses, projectedNet } };
}
