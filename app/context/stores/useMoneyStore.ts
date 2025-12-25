import { create } from "zustand";
import { getMockBudgets, getMockCashFlowSeries, getMockMoneyOverview } from "@app/mock/services/accountingService";

export type MoneyOverview = {
  incomeYTD: number;
  expensesYTD: number;
  profitYTD: number;
  taxReserve: number;
};

export type BudgetItem = {
  id: string;
  category: string;
  limit: number;
  spent: number;
};

export type CashFlowPoint = {
  label: string;
  inflow: number;
  outflow: number;
};

type MoneyState = {
  overview: MoneyOverview | null;
  budgets: BudgetItem[];
  cashFlow: CashFlowPoint[];
  refresh: () => Promise<void>;
};

export const useMoneyStore = create<MoneyState>((set) => ({
  overview: null,
  budgets: [],
  cashFlow: [],
  refresh: async () => {
    const [overview, budgets, cashFlow] = await Promise.all([
      getMockMoneyOverview(),
      getMockBudgets(),
      getMockCashFlowSeries(),
    ]);
    set({ overview, budgets, cashFlow });
  },
}));
