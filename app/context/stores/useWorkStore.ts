import { create } from "zustand";
import { getMockKanbanBoard, getMockWorkSummary } from "@app/mock/services/projectsService";

export type WorkSummary = {
  activeProjects: number;
  openTasks: number;
  nextDueDate: string;
};

export type KanbanCard = {
  id: string;
  title: string;
  meta?: string;
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
};

export const useWorkStore = create<WorkState>((set) => ({
  summary: null,
  board: null,
  refresh: async () => {
    const [summary, board] = await Promise.all([getMockWorkSummary(), getMockKanbanBoard()]);
    set({ summary, board });
  },
}));
