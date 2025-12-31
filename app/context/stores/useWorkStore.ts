import { create } from "zustand";
import {
  getMockCalendarEvents,
  getMockCashFlowForecast,
  getMockKanbanBoard,
  getMockTasks,
  getMockWorkSummary,
} from "@app/mock/services/projectsService";
import { createId } from "@app/utils/id";

export type WorkSummary = {
  activeProjects: number;
  openTasks: number;
  nextDueDate: string;
};

export type KanbanCard = {
  id: string;
  title: string;
  meta?: string;
  progress?: number; // 0..1
  deadline?: string; // ISO date
  avatar?: string; // initials
};

export type KanbanColumn = {
  key: "todo" | "doing" | "done";
  title: string;
  cards: KanbanCard[];
};

export type KanbanBoard = {
  columns: KanbanColumn[];
};

export type WorkTask = {
  id: string;
  title: string;
  due: string;
  status: "open" | "blocked" | "done";
  clientId?: string;
  client?: string;
  projectId?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
};

export type CashFlowForecast = {
  next30Days: {
    expectedIncome: number;
    expectedExpenses: number;
    projectedNet: number;
  };
};

type WorkState = {
  summary: WorkSummary | null;
  board: KanbanBoard | null;
  tasks: WorkTask[];
  calendarEvents: CalendarEvent[];
  forecast: CashFlowForecast | null;
  refresh: () => Promise<void>;
  addToBoard: (input: { title: string; meta?: string }) => void;
};

export const useWorkStore = create<WorkState>((set) => ({
  summary: null,
  board: null,
  tasks: [],
  calendarEvents: [],
  forecast: null,
  refresh: async () => {
    const [summary, board, tasks, calendarEvents, forecast] = await Promise.all([
      getMockWorkSummary(),
      getMockKanbanBoard(),
      getMockTasks(),
      getMockCalendarEvents(),
      getMockCashFlowForecast(),
    ]);
    set({ summary, board, tasks, calendarEvents, forecast });
  },
  addToBoard: ({ title, meta }) => {
    set((state) => {
      const board: KanbanBoard =
        state.board ??
        ({
          columns: [
            { key: "todo", title: "To Do", cards: [] },
            { key: "doing", title: "Doing", cards: [] },
            { key: "done", title: "Done", cards: [] },
          ],
        } satisfies KanbanBoard);

      const next = {
        ...board,
        columns: board.columns.map((col) =>
          col.key === "todo"
            ? {
                ...col,
                cards: [{ id: createId("card"), title, meta }, ...col.cards],
              }
            : col
        ),
      } satisfies KanbanBoard;

      return { board: next };
    });
  },
}));
