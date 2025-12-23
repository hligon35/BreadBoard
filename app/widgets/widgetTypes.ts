import type { CategoryKey } from "@app/theme/tokens";

export type WidgetSize = "S" | "M" | "L";

export type WidgetTypeKey =
  | "IncomeExpense"
  | "TaxCountdown"
  | "ClientsAtRisk"
  | "ActiveProjects"
  | "Mileage"
  | "CashFlow"
  | "AISuggestions"
  | "Badges";

export type WidgetLayoutItem = {
  id: string;
  type: WidgetTypeKey;
  size: WidgetSize;
};

export type WidgetPreset = {
  id: string;
  name: string;
  layout: WidgetLayoutItem[];
};

export type WidgetDefinition = {
  type: WidgetTypeKey;
  title: string;
  category: CategoryKey;
  description: string;
};

export const widgetCatalog: WidgetDefinition[] = [
  {
    type: "IncomeExpense",
    title: "Income vs Expenses",
    category: "money",
    description: "Quick profit glance (mock).",
  },
  {
    type: "TaxCountdown",
    title: "Tax Countdown",
    category: "compliance",
    description: "Days until next filing (mock).",
  },
  {
    type: "ClientsAtRisk",
    title: "Clients at Risk",
    category: "clients",
    description: "Accounts needing attention (mock).",
  },
  {
    type: "ActiveProjects",
    title: "Active Projects",
    category: "work",
    description: "Projects in flight (mock).",
  },
  {
    type: "Mileage",
    title: "Mileage",
    category: "money",
    description: "Mileage/time tracking summary (mock).",
  },
  {
    type: "CashFlow",
    title: "Cash Flow",
    category: "money",
    description: "Forecast summary (mock).",
  },
  {
    type: "AISuggestions",
    title: "AI Suggestions",
    category: "insights",
    description: "Placeholder mentor tips (mock).",
  },
  {
    type: "Badges",
    title: "Badges",
    category: "insights",
    description: "Gamification progress (mock).",
  },
];
