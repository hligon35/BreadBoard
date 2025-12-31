import type { MoneyOverview } from "@app/context/stores/useMoneyStore";
import { mockDb } from "@app/mock/data/mockDb";

function sum(xs: number[]) {
  return xs.reduce((s, n) => s + n, 0);
}

export async function getMockMoneyOverview(): Promise<MoneyOverview> {
  const incomes = mockDb.moneyTransactions.filter((t) => t.type === "income").map((t) => t.amount);
  const expenses = mockDb.moneyTransactions.filter((t) => t.type === "expense").map((t) => t.amount);
  const incomeYTD = sum(incomes);
  const expensesYTD = sum(expenses);
  const profitYTD = incomeYTD - expensesYTD;
  const taxReserve = Math.round(Math.max(0, profitYTD * 0.25));
  return { incomeYTD, expensesYTD, profitYTD, taxReserve };
}

export async function getMockIncomeTransactions() {
  const nameById = new Map(mockDb.clients.map((c) => [c.id, c.name] as const));
  return mockDb.moneyTransactions
    .filter((t) => t.type === "income")
    .slice(-30)
    .reverse()
    .map((t) => ({
      id: t.id,
      clientId: t.clientId,
      client: t.clientId ? nameById.get(t.clientId) ?? t.clientId : "—",
      amount: t.amount,
      date: t.date,
      memo: t.memo,
      invoiceId: t.invoiceId,
    }));
}

export async function getMockExpenseTransactions() {
  return mockDb.moneyTransactions
    .filter((t) => t.type === "expense")
    .slice(-40)
    .reverse()
    .map((t) => ({
      id: t.id,
      vendor: t.vendor ?? "—",
      category: t.category ?? "—",
      amount: t.amount,
      date: t.date,
      memo: t.memo,
    }));
}

export async function getMockBudgets() {
  return mockDb.budgets;
}

export async function getMockCashFlowSeries() {
  return mockDb.cashFlow;
}

export async function getMockInvoices() {
  const nameById = new Map(mockDb.clients.map((c) => [c.id, c.name] as const));
  return mockDb.invoices
    .slice()
    .sort((a, b) => (a.dueAt < b.dueAt ? 1 : -1))
    .map((inv) => ({
      id: inv.id,
      clientId: inv.clientId,
      client: nameById.get(inv.clientId) ?? inv.clientId,
      amount: inv.amount,
      status: inv.status,
      issuedAt: inv.issuedAt,
      dueAt: inv.dueAt,
      paidAt: inv.paidAt,
    }));
}
