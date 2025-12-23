import React, { useEffect, useMemo } from "react";
import { useClientsStore } from "@app/context/stores/useClientsStore";

export function ClientsAtRiskWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);

  useEffect(() => {
    if (!clients.length) refresh();
  }, [clients.length, refresh]);

  const atRisk = useMemo(() => clients.filter((c) => c.status === "at_risk"), [clients]);
  return (
    <>
      <Text>{atRisk.length} at-risk clients</Text>
      {atRisk.slice(0, 3).map((c) => (
        <Text key={c.id}>• {c.name}</Text>
      ))}
    </>
  );
}
