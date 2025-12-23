import { create } from "zustand";
import { getMockMoneyOverview } from "@app/mock/services/accountingService";

export type MoneyOverview = {
  incomeYTD: number;
  expensesYTD: number;
  profitYTD: number;
  taxReserve: number;
};

type MoneyState = {
  overview: MoneyOverview | null;
  refresh: () => Promise<void>;
};

export const useMoneyStore = create<MoneyState>((set) => ({
  overview: null,
  refresh: async () => {
    const data = await getMockMoneyOverview();
    set({ overview: data });
  },
}));
