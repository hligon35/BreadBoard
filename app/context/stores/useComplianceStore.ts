import { create } from "zustand";
import {
  getMockAuditLog,
  getMockComplianceOverview,
  getMockTaxForms,
} from "@app/mock/services/complianceService";

export type ComplianceOverview = {
  nextFilingLabel: string;
  daysRemaining: number;
  openItems: number;
  estimatedTaxDue: number;
  estimatedTaxPaid: number;
};

export type TaxForm = {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "complete";
  dueAt: string;
};

export type AuditLogItem = {
  id: string;
  at: string;
  action: string;
};

type ComplianceState = {
  overview: ComplianceOverview | null;
  forms: TaxForm[];
  auditLog: AuditLogItem[];
  refresh: () => Promise<void>;
};

export const useComplianceStore = create<ComplianceState>((set) => ({
  overview: null,
  forms: [],
  auditLog: [],
  refresh: async () => {
    const [overview, forms, auditLog] = await Promise.all([
      getMockComplianceOverview(),
      getMockTaxForms(),
      getMockAuditLog(),
    ]);
    set({ overview, forms, auditLog });
  },
}));
