import { create } from "zustand";
import { getMockComplianceOverview } from "@app/mock/services/complianceService";

export type ComplianceOverview = {
  nextFilingLabel: string;
  daysRemaining: number;
  openItems: number;
};

type ComplianceState = {
  overview: ComplianceOverview | null;
  refresh: () => Promise<void>;
};

export const useComplianceStore = create<ComplianceState>((set) => ({
  overview: null,
  refresh: async () => {
    const data = await getMockComplianceOverview();
    set({ overview: data });
  },
}));
