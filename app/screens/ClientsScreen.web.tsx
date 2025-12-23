import React, { useEffect, useState } from "react";
import { Col, H1, Muted, Tabs, TablePlaceholder, ChartPlaceholder } from "@ui/web";
import { useClientsStore } from "@app/context/stores/useClientsStore";

const clientTabs = [
  { key: "clients", label: "Clients" },
  { key: "contracts", label: "Proposals & Contracts" },
  { key: "portal", label: "Portfolio & Client Portal" },
];

export function ClientsScreen() {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);
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
      {tab === "clients" && <TablePlaceholder title="Clients list" />}
      {tab === "contracts" && <TablePlaceholder title="Proposals & contracts" />}
      {tab === "portal" && <ChartPlaceholder title="Portfolio & client portal placeholder" />}
    </Col>
  );
}
