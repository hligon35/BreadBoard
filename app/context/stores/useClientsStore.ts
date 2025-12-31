import { create } from "zustand";
import { getMockClientPortalSummary, getMockClients, getMockProposals } from "@app/mock/services/crmService";

export type Client = {
  id: string;
  name: string;
  status: "active" | "at_risk" | "inactive";
  lastInvoiceAmount: number;
  riskLevel?: "low" | "medium" | "high";
  riskReason?: string;
  lastTouchDaysAgo?: number;
};

export type Proposal = {
  id: string;
  clientId: string;
  client: string;
  title?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  value: number;
  createdAt?: string;
};

export type ClientPortalSummary = {
  enabled: boolean;
  lastLogin: string | null;
  notes?: string;
};

type ClientsState = {
  clients: Client[];
  proposals: Proposal[];
  portalSummary: ClientPortalSummary | null;
  refresh: () => Promise<void>;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  proposals: [],
  portalSummary: null,
  refresh: async () => {
    const [clients, proposals, portalSummary] = await Promise.all([
      getMockClients(),
      getMockProposals(),
      getMockClientPortalSummary(),
    ]);
    set({ clients, proposals, portalSummary });
  },
}));
