import type { WidgetPreset } from "./widgetTypes";

export const defaultDashboardPreset: WidgetPreset = {
  id: "preset_default",
  name: "Default",
  layout: [
    { id: "w_income", type: "IncomeExpense", size: "L" },
    { id: "w_cash", type: "CashFlow", size: "M" },
    { id: "w_tax", type: "TaxCountdown", size: "M" },
    { id: "w_clients", type: "ClientsAtRisk", size: "M" },
    { id: "w_projects", type: "ActiveProjects", size: "M" },
    { id: "w_ai", type: "AISuggestions", size: "S" },
    { id: "w_badges", type: "Badges", size: "S" },
  ],
};
