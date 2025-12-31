import React, { useEffect, useState } from "react";
import { Card, Container, H1, Muted, Screen, Scroll, Tabs } from "@ui/native";
import { useClientsStore } from "@app/context/stores/useClientsStore";

const clientTabs = [
  { key: "clients", label: "Clients" },
  { key: "contracts", label: "Proposals" },
  { key: "portal", label: "Portal" },
];

export function ClientsScreen() {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);
  const proposals = useClientsStore((s) => s.proposals);
  const portalSummary = useClientsStore((s) => s.portalSummary);
  const [tab, setTab] = useState("clients");

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Clients</H1>
          <Muted>{clients.length ? `${clients.length} mock clients` : "Loading mock clients..."}</Muted>
          <Tabs items={clientTabs} activeKey={tab} onChange={setTab} />
          {tab === "clients" && (
            <Card>
              <Muted>Clients</Muted>
              {clients.map((c) => (
                <Card key={c.id}>
                  <Muted>
                    {c.name} • {c.status.toUpperCase()} • risk {c.riskLevel ?? "—"}
                  </Muted>
                  <Muted>Last invoice: ${c.lastInvoiceAmount.toLocaleString()}</Muted>
                  <Muted>
                    Last touch: {typeof c.lastTouchDaysAgo === "number" ? `${c.lastTouchDaysAgo} days` : "—"}
                  </Muted>
                </Card>
              ))}
              {clients.length === 0 && <Muted>No clients</Muted>}
            </Card>
          )}

          {tab === "contracts" && (
            <Card>
              <Muted>Proposals</Muted>
              {proposals.map((p) => (
                <Card key={p.id}>
                  <Muted>
                    {p.client} • {p.status.toUpperCase()} • ${p.value.toLocaleString()}
                  </Muted>
                </Card>
              ))}
              {proposals.length === 0 && <Muted>No proposals</Muted>}
            </Card>
          )}

          {tab === "portal" && (
            <Card>
              <Muted>Client portal</Muted>
              {portalSummary ? (
                <>
                  <Muted>Enabled: {portalSummary.enabled ? "Yes" : "No"}</Muted>
                  <Muted>Last login: {portalSummary.lastLogin ?? "—"}</Muted>
                  {portalSummary.notes ? <Muted>{portalSummary.notes}</Muted> : null}
                </>
              ) : (
                <Muted>Loading portal summary…</Muted>
              )}
            </Card>
          )}
        </Container>
      </Scroll>
    </Screen>
  );
}
