import { create } from "zustand";
import { getMockWorkSummary } from "@app/mock/services/projectsService";

export type WorkSummary = {
  activeProjects: number;
  openTasks: number;
  nextDueDate: string;
};

type WorkState = {
  summary: WorkSummary | null;
  refresh: () => Promise<void>;
};

export const useWorkStore = create<WorkState>((set) => ({
  summary: null,
  refresh: async () => {
    const data = await getMockWorkSummary();
    set({ summary: data });
  },
}));
