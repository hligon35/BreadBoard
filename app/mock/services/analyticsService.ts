import type { InsightsOverview } from "@app/context/stores/useInsightsStore";
import { mockDb } from "@app/mock/data/mockDb";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export async function getMockInsightsOverview(): Promise<InsightsOverview> {
  const atRisk = mockDb.clients.filter((c) => c.riskLevel === "high");
  const disputed = atRisk.find((c) => c.riskReason.toLowerCase().includes("dispute")) ?? atRisk[0];
  const late = atRisk.find((c) => c.riskReason.toLowerCase().includes("late")) ?? atRisk[1];

  const openTasks = mockDb.tasks.filter((t) => t.status !== "done");
  const blocked = mockDb.tasks.filter((t) => t.status === "blocked");

  const income = mockDb.moneyTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = mockDb.moneyTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const profit = income - expenses;

  const profitabilityScore = Math.round(clamp01(profit / Math.max(1, income)) * 100);
  const efficiencyScore = Math.max(40, Math.min(95, 65 + Math.round((openTasks.length - blocked.length) / 2)));
  const revenueTrend: InsightsOverview["revenueTrend"] = profit >= 0 ? "up" : "down";

  const aiSuggestions: InsightsOverview["aiSuggestions"] = [
    {
      id: "ai_1",
      category: "Clients",
      urgency: "High",
      impact: "High",
      title: late ? `Follow up with ${late.name}` : "Follow up with at-risk clients",
      detail: late
        ? `Last touchpoint was ${late.lastTouchDaysAgo}+ days ago; renewal risk is rising.`
        : "Last touchpoint was 12+ days ago; renewal risk is rising.",
      why: "Customer health signals indicate rising churn risk and a long gap since last contact.",
      actionLabel: "Send follow-up",
    },
    {
      id: "ai_2",
      category: "Clients",
      urgency: "High",
      impact: "High",
      title: disputed ? `Resolve payment dispute (${disputed.name})` : "Resolve payment disputes",
      detail: "Clearing blockers now increases cash predictability.",
      why: "Disputes slow collections and can escalate; resolving early improves cashflow reliability.",
      actionLabel: "Review",
    },
    {
      id: "ai_3",
      category: "Finance",
      urgency: "Medium",
      impact: "High",
      title: "Set aside 25% for tax reserve",
      detail: `Profit is ${profit >= 0 ? "positive" : "negative"}; a reserve reduces surprise tax swings.`,
      why: "Income volatility increases tax risk; allocating a reserve stabilizes cash planning.",
      actionLabel: "Allocate",
    },
    {
      id: "ai_4",
      category: "Workflow",
      urgency: blocked.length ? "Medium" : "Low",
      impact: blocked.length ? "High" : "Medium",
      title: blocked.length ? `Unblock ${blocked.length} task${blocked.length === 1 ? "" : "s"}` : "Schedule a portfolio refresh",
      detail: blocked.length ? "Blocked tasks are dragging throughput." : "You haven’t updated your portfolio this month.",
      why: blocked.length
        ? "Removing blockers improves delivery speed and reduces context switching."
        : "Fresh work improves conversion and keeps outreach materials current.",
      actionLabel: blocked.length ? "Triage" : "Schedule",
    },
    {
      id: "ai_5",
      category: "Workflow",
      urgency: "Low",
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
  ];

  return {
    revenueTrend,
    profitabilityScore,
    efficiencyScore,
    gamificationLevel: 3,
    nextBadgeLabel: "Builder",
    nextBadgeProgress: 0.73,
    earnedBadges: ["Consistent Invoicer", "Fast Responder", "Profit Positive", "On-Time Delivery"],
    streakDays: 12,
    xpPoints: 860,
    xpNextLevelPoints: 1200,
    upcomingAchievements: ["Level 4: Operator", "Level 5: Strategist", "Skillshare badge"],
    aiSuggestions,
  };
}

export async function getMockRevenueTrends() {
  // Derive a stable-looking trend from YTD average.
  const income = mockDb.moneyTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const avg = income / 12;
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({
    month: m,
    value: Math.round(avg * (0.82 + i * 0.06)),
  }));
}
