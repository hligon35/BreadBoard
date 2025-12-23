import type { InsightsOverview } from "@app/context/stores/useInsightsStore";

export async function getMockInsightsOverview(): Promise<InsightsOverview> {
  return {
    revenueTrend: "up",
    profitabilityScore: 82,
    efficiencyScore: 73,
    gamificationLevel: 4,
  };
}

export async function getMockRevenueTrends() {
  return [
    { month: "Aug", value: 5200 },
    { month: "Sep", value: 6100 },
    { month: "Oct", value: 7200 },
    { month: "Nov", value: 6800 },
    { month: "Dec", value: 8400 },
  ];
}
