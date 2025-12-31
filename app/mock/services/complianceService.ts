import type { ComplianceOverview } from "@app/context/stores/useComplianceStore";
import { mockDb } from "@app/mock/data/mockDb";

export async function getMockComplianceOverview(): Promise<ComplianceOverview> {
  const openItems = mockDb.complianceForms.filter((f) => f.status !== "complete").length;

  // Pick the nearest upcoming due date as the "next filing".
  const next = mockDb.complianceForms
    .slice()
    .sort((a, b) => (a.dueAt > b.dueAt ? 1 : -1))[0];

  const now = new Date();
  const due = next ? new Date(next.dueAt) : new Date();
  const daysRemaining = Math.max(0, Math.ceil((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

  // Tie tax amounts to profit-ish heuristic (coordinated with accounting service).
  const income = mockDb.moneyTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = mockDb.moneyTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const profit = income - expenses;
  const estimatedTaxDue = Math.round(Math.max(0, profit * 0.25));
  const estimatedTaxPaid = Math.round(estimatedTaxDue * 0.65);

  return {
    nextFilingLabel: next?.name ?? "Quarterly Estimated Tax",
    daysRemaining,
    openItems,
    estimatedTaxDue,
    estimatedTaxPaid,
  };
}

export async function getMockTaxForms() {
  return mockDb.complianceForms.map((f) => ({
    id: f.id,
    name: f.name,
    status: f.status,
    dueAt: f.dueAt,
  }));
}

export async function getMockAuditLog() {
  return mockDb.auditLog;
}
