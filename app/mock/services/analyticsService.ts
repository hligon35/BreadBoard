import type { InsightsOverview } from "@app/context/stores/useInsightsStore";

export async function getMockInsightsOverview(): Promise<InsightsOverview> {
  return {
    revenueTrend: "up",
    profitabilityScore: 82,
    efficiencyScore: 73,
    gamificationLevel: 3,
    nextBadgeLabel: "Builder",
    nextBadgeProgress: 0.73,
    earnedBadges: ["Consistent Invoicer", "Fast Responder", "Profit Positive", "On-Time Delivery"],
    streakDays: 12,
    xpPoints: 860,
    xpNextLevelPoints: 1200,
    upcomingAchievements: ["Level 4: Operator", "Level 5: Strategist", "Skillshare badge"],
    aiSuggestions: [
      {
        id: "ai_1",
        category: "Clients",
        urgency: "High",
        impact: "High",
        title: "Follow up with Northwind",
        detail: "Last touchpoint was 12+ days ago; renewal risk is rising.",
        why: "Customer health signals indicate rising churn risk and a long gap since last contact.",
        actionLabel: "Send follow‑up",
      },
      {
        id: "ai_2",
        category: "Finance",
        urgency: "Medium",
        impact: "High",
        title: "Set aside 25% for tax reserve",
        detail: "Your net inflow is trending up; reserve now to avoid surprises.",
        why: "Income volatility increases tax risk; allocating a reserve stabilizes cash planning.",
        actionLabel: "Allocate",
      },
      {
        id: "ai_3",
        category: "Workflow",
        urgency: "Low",
        impact: "Medium",
        title: "Schedule a portfolio refresh",
        detail: "You haven’t updated your portfolio this month.",
        why: "Fresh work improves conversion and keeps outreach materials current.",
        actionLabel: "Schedule",
      },
      {
        id: "ai_4",
        category: "Clients",
        urgency: "High",
        impact: "High",
        title: "Resolve payment dispute (Initech)",
        detail: "Clearing blockers now increases cash predictability.",
        why: "Disputes slow collections and can escalate; resolving early improves cashflow reliability.",
        actionLabel: "Review",
      },
      {
        id: "ai_5",
        category: "Workflow",
        urgency: "Medium",
        impact: "Medium",
        title: "Batch invoices for Friday",
        detail: "Batching reduces context switching and speeds collection.",
        why: "Grouping similar work reduces task switching overhead and improves throughput.",
        actionLabel: "Plan batch",
      },
      {
        id: "ai_6",
        category: "Finance",
        urgency: "Low",
        impact: "Medium",
        title: "Tighten expense categories",
        detail: "Two categories are overspending vs. budget.",
        why: "Category drift can hide leaks; tighter grouping clarifies where to cut spend.",
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
