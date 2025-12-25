import type { ComplianceOverview } from "@app/context/stores/useComplianceStore";

export async function getMockComplianceOverview(): Promise<ComplianceOverview> {
  return {
    nextFilingLabel: "Quarterly Estimated Tax",
    daysRemaining: 21,
    openItems: 3,
    estimatedTaxDue: 12500,
    estimatedTaxPaid: 8400,
  };
}

export async function getMockTaxForms() {
  return [
    { id: "f1", name: "1099-NEC", status: "not_started" },
    { id: "f2", name: "Schedule C", status: "in_progress" },
  ];
}

export async function getMockAuditLog() {
  return [
    { id: "a1", at: "2025-12-20", action: "Updated branding settings" },
    { id: "a2", at: "2025-12-18", action: "Saved dashboard preset" },
  ];
}
