import React, { useEffect, useState } from "react";
import { Card, Col, H1, Muted, Tabs } from "@ui/web";
import { useClientsStore } from "@app/context/stores/useClientsStore";

const clientTabs = [
  { key: "clients", label: "Clients" },
  { key: "contracts", label: "Proposals & Contracts" },
  { key: "portal", label: "Portfolio & Client Portal" },
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
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Clients</H1>
        <Muted>{clients.length ? `${clients.length} mock clients` : "Loading mock clients..."}</Muted>
      </div>
      <Tabs items={clientTabs} activeKey={tab} onChange={setTab} />
      {tab === "clients" && (
        <Card>
          <Muted>Clients</Muted>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Risk</th>
                <th style={{ textAlign: "right" }}>Last invoice</th>
                <th style={{ textAlign: "right" }}>Last touch</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.status}</td>
                  <td>{c.riskLevel ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>${c.lastInvoiceAmount.toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    {typeof c.lastTouchDaysAgo === "number" ? `${c.lastTouchDaysAgo}d` : "—"}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <Muted>No clients</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "contracts" && (
        <Card>
          <Muted>Proposals & contracts</Muted>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Client</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "right" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id}>
                  <td>{p.client}</td>
                  <td>{p.status}</td>
                  <td style={{ textAlign: "right" }}>${p.value.toLocaleString()}</td>
                </tr>
              ))}
              {proposals.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <Muted>No proposals</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "portal" && (
        <Card>
          <Muted>Portfolio & client portal</Muted>
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
    </Col>
  );
}
