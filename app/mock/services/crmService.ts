import type { Client } from "@app/context/stores/useClientsStore";
import { mockDb } from "@app/mock/data/mockDb";

export async function getMockClients(): Promise<Client[]> {
  const lastPaidByClient = new Map<string, number>();
  for (const inv of mockDb.invoices) {
    if (inv.status !== "paid") continue;
    const cur = lastPaidByClient.get(inv.clientId) ?? 0;
    lastPaidByClient.set(inv.clientId, Math.max(cur, inv.amount));
  }

  return mockDb.clients.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    lastInvoiceAmount: lastPaidByClient.get(c.id) ?? 0,
    riskLevel: c.riskLevel,
    riskReason: c.riskReason,
    lastTouchDaysAgo: c.lastTouchDaysAgo,
  }));
}

export async function getMockProposals() {
  const nameById = new Map(mockDb.clients.map((c) => [c.id, c.name] as const));
  return mockDb.proposals.map((p) => ({
    id: p.id,
    clientId: p.clientId,
    client: nameById.get(p.clientId) ?? p.clientId,
    title: p.title,
    status: p.status,
    value: p.value,
    createdAt: p.createdAt,
  }));
}

export async function getMockClientPortalSummary() {
  return {
    enabled: false,
    lastLogin: null,
    notes: "Client Portal is a placeholder module (no auth/backend yet). Data below is coordinated mock-only.",
  };
}
