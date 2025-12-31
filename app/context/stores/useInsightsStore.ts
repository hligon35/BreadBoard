import { create } from "zustand";
import { getMockInsightsOverview, getMockRevenueTrends } from "@app/mock/services/analyticsService";

export type AISuggestion = {
  id: string;
  category: "Finance" | "Clients" | "Workflow";
  urgency: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  title: string;
  detail: string;
  why: string;
  actionLabel: string;
};

export type InsightsOverview = {
  revenueTrend: "up" | "down" | "flat";
  profitabilityScore: number;
  efficiencyScore: number;
  gamificationLevel: number;
  nextBadgeLabel: string;
  nextBadgeProgress: number; // 0..1
  earnedBadges: string[];
  streakDays: number;
  xpPoints: number;
  xpNextLevelPoints: number;
  upcomingAchievements: string[];
  aiSuggestions: AISuggestion[];
};

export type RevenueTrendPoint = {
  month: string;
  value: number;
};

type InsightsState = {
  overview: InsightsOverview | null;
  revenueTrends: RevenueTrendPoint[];
  refresh: () => Promise<void>;
};

export const useInsightsStore = create<InsightsState>((set) => ({
  overview: null,
  revenueTrends: [],
  refresh: async () => {
    const [overview, revenueTrends] = await Promise.all([
      getMockInsightsOverview(),
      getMockRevenueTrends(),
    ]);
    set({ overview, revenueTrends });
  },
}));
