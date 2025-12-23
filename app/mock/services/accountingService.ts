import type { MoneyOverview } from "@app/context/stores/useMoneyStore";

export async function getMockMoneyOverview(): Promise<MoneyOverview> {
  return {
    incomeYTD: 84250,
    expensesYTD: 31220,
    profitYTD: 53030,
    taxReserve: 12500,
  };
}

export async function getMockIncomeTransactions() {
  return [
    { id: "inc_1", client: "Acme Co", amount: 4200, date: "2025-12-18" },
    { id: "inc_2", client: "Northwind", amount: 1800, date: "2025-12-10" },
    { id: "inc_3", client: "Globex", amount: 650, date: "2025-12-02" },
  ];
}

export async function getMockExpenseTransactions() {
  return [
    { id: "exp_1", vendor: "Adobe", amount: 59.99, date: "2025-12-15" },
    { id: "exp_2", vendor: "AWS", amount: 112.34, date: "2025-12-12" },
    { id: "exp_3", vendor: "Office Depot", amount: 38.21, date: "2025-12-05" },
  ];
}

export async function getMockBudgets() {
  return [
    { id: "bud_1", category: "Software", limit: 250, spent: 172 },
    { id: "bud_2", category: "Marketing", limit: 400, spent: 95 },
    { id: "bud_3", category: "Ops", limit: 300, spent: 220 },
  ];
}
