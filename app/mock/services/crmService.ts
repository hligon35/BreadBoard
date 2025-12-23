import type { Client } from "@app/context/stores/useClientsStore";

export async function getMockClients(): Promise<Client[]> {
  return [
    { id: "cli_1", name: "Acme Co", status: "active", lastInvoiceAmount: 4200 },
    { id: "cli_2", name: "Northwind", status: "at_risk", lastInvoiceAmount: 1800 },
    { id: "cli_3", name: "Globex", status: "inactive", lastInvoiceAmount: 0 },
  ];
}

export async function getMockProposals() {
  return [
    { id: "prop_1", client: "Acme Co", status: "sent", value: 6000 },
    { id: "prop_2", client: "Northwind", status: "draft", value: 2400 },
  ];
}

export async function getMockClientPortalSummary() {
  return {
    enabled: false,
    lastLogin: null,
    notes: "Client Portal is a placeholder module (no auth/backend yet).",
  };
}
