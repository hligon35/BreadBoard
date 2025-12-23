import { create } from "zustand";
import { getMockInsightsOverview } from "@app/mock/services/analyticsService";

export type InsightsOverview = {
  revenueTrend: "up" | "down" | "flat";
  profitabilityScore: number;
  efficiencyScore: number;
  gamificationLevel: number;
};

type InsightsState = {
  overview: InsightsOverview | null;
  refresh: () => Promise<void>;
};

export const useInsightsStore = create<InsightsState>((set) => ({
  overview: null,
  refresh: async () => {
    const data = await getMockInsightsOverview();
    set({ overview: data });
  },
}));
