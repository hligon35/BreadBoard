import type { Client } from "@app/context/stores/useClientsStore";

export async function getMockClients(): Promise<Client[]> {
  return [
    {
      id: "cli_1",
      name: "Acme Co",
      status: "active",
      lastInvoiceAmount: 4200,
      riskLevel: "low",
      riskReason: "Healthy engagement",
    },
    {
      id: "cli_2",
      name: "Northwind",
      status: "at_risk",
      lastInvoiceAmount: 1800,
      riskLevel: "high",
      riskReason: "Late invoice",
    },
    {
      id: "cli_3",
      name: "Globex",
      status: "inactive",
      lastInvoiceAmount: 0,
      riskLevel: "medium",
      riskReason: "Low engagement",
    },
    {
      id: "cli_4",
      name: "Initech",
      status: "at_risk",
      lastInvoiceAmount: 2600,
      riskLevel: "high",
      riskReason: "Payment dispute",
    },
    {
      id: "cli_5",
      name: "Umbrella",
      status: "inactive",
      lastInvoiceAmount: 900,
      riskLevel: "medium",
      riskReason: "No recent activity",
    },
    {
      id: "cli_6",
      name: "Soylent",
      status: "at_risk",
      lastInvoiceAmount: 1200,
      riskLevel: "high",
      riskReason: "Overdue renewal",
    },
    {
      id: "cli_7",
      name: "Hooli",
      status: "active",
      lastInvoiceAmount: 5200,
      riskLevel: "low",
      riskReason: "On-time payments",
    },
    {
      id: "cli_8",
      name: "Stark Industries",
      status: "inactive",
      lastInvoiceAmount: 1500,
      riskLevel: "medium",
      riskReason: "Scope stalled",
    },
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
