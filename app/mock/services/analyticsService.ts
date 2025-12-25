import type { InsightsOverview } from "@app/context/stores/useInsightsStore";

export async function getMockInsightsOverview(): Promise<InsightsOverview> {
  return {
    revenueTrend: "up",
    profitabilityScore: 82,
    efficiencyScore: 73,
    gamificationLevel: 4,
    nextBadgeLabel: "Gold Ops",
    nextBadgeProgress: 0.73,
    earnedBadges: ["Consistent Invoicer", "Fast Responder", "Profit Positive", "On-Time Delivery"],
    aiSuggestions: [
      {
        id: "ai_1",
        category: "Clients",
        title: "Follow up with Northwind",
        detail: "Last touchpoint was 12+ days ago; renewal risk is rising.",
        actionLabel: "Send follow‑up",
      },
      {
        id: "ai_2",
        category: "Finance",
        title: "Set aside 25% for tax reserve",
        detail: "Your net inflow is trending up; reserve now to avoid surprises.",
        actionLabel: "Allocate",
      },
      {
        id: "ai_3",
        category: "Workflow",
        title: "Schedule a portfolio refresh",
        detail: "You haven’t updated your portfolio this month.",
        actionLabel: "Schedule",
      },
      {
        id: "ai_4",
        category: "Clients",
        title: "Resolve payment dispute (Initech)",
        detail: "Clearing blockers now increases cash predictability.",
        actionLabel: "Review",
      },
      {
        id: "ai_5",
        category: "Workflow",
        title: "Batch invoices for Friday",
        detail: "Batching reduces context switching and speeds collection.",
        actionLabel: "Plan batch",
      },
      {
        id: "ai_6",
        category: "Finance",
        title: "Tighten expense categories",
        detail: "Two categories are overspending vs. budget.",
        actionLabel: "Inspect",
      },
    ],
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
