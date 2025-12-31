import { create } from "zustand";
import {
  getMockBudgets,
  getMockCashFlowSeries,
  getMockExpenseTransactions,
  getMockIncomeTransactions,
  getMockInvoices,
  getMockMoneyOverview,
} from "@app/mock/services/accountingService";

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

export type IncomeTransaction = {
  id: string;
  clientId?: string;
  client: string;
  amount: number;
  date: string;
  memo?: string;
  invoiceId?: string;
};

export type ExpenseTransaction = {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  memo?: string;
};

export type Invoice = {
  id: string;
  clientId: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "due" | "overdue";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
};

type MoneyState = {
  overview: MoneyOverview | null;
  budgets: BudgetItem[];
  cashFlow: CashFlowPoint[];
  incomeTransactions: IncomeTransaction[];
  expenseTransactions: ExpenseTransaction[];
  invoices: Invoice[];
  refresh: () => Promise<void>;
};

export const useMoneyStore = create<MoneyState>((set) => ({
  overview: null,
  budgets: [],
  cashFlow: [],
  incomeTransactions: [],
  expenseTransactions: [],
  invoices: [],
  refresh: async () => {
    const [overview, budgets, cashFlow, incomeTransactions, expenseTransactions, invoices] = await Promise.all([
      getMockMoneyOverview(),
      getMockBudgets(),
      getMockCashFlowSeries(),
      getMockIncomeTransactions(),
      getMockExpenseTransactions(),
      getMockInvoices(),
    ]);
    set({ overview, budgets, cashFlow, incomeTransactions, expenseTransactions, invoices });
  },
}));
