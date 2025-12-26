import { create } from "zustand";
import { getMockKanbanBoard, getMockWorkSummary } from "@app/mock/services/projectsService";
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

type WorkState = {
  summary: WorkSummary | null;
  board: KanbanBoard | null;
  refresh: () => Promise<void>;
  addToBoard: (input: { title: string; meta?: string }) => void;
};

export const useWorkStore = create<WorkState>((set) => ({
  summary: null,
  board: null,
  refresh: async () => {
    const [summary, board] = await Promise.all([getMockWorkSummary(), getMockKanbanBoard()]);
    set({ summary, board });
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
