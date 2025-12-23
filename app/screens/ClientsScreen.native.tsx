import React, { useEffect, useState } from "react";
import { ChartPlaceholder, Container, H1, Muted, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useClientsStore } from "@app/context/stores/useClientsStore";

const clientTabs = [
  { key: "clients", label: "Clients" },
  { key: "contracts", label: "Proposals" },
  { key: "portal", label: "Portal" },
];

export function ClientsScreen() {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);
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
          {tab === "clients" && <TablePlaceholder title="Clients list" />}
          {tab === "contracts" && <TablePlaceholder title="Proposals & contracts" />}
          {tab === "portal" && <ChartPlaceholder title="Portfolio/portal placeholder" />}
        </Container>
      </Scroll>
    </Screen>
  );
}
