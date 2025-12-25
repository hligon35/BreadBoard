import { create } from "zustand";
import { getMockClients } from "@app/mock/services/crmService";

export type Client = {
  id: string;
  name: string;
  status: "active" | "at_risk" | "inactive";
  lastInvoiceAmount: number;
  riskLevel?: "low" | "medium" | "high";
  riskReason?: string;
};

type ClientsState = {
  clients: Client[];
  refresh: () => Promise<void>;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  refresh: async () => {
    const data = await getMockClients();
    set({ clients: data });
  },
}));
