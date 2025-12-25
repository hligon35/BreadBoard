import React, { useEffect, useMemo } from "react";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

type Tone = "danger" | "warning" | "success";

export function ClientsAtRiskWidget({
  Text,
  StrongText,
  Row,
  Tag,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Row?: React.ComponentType<{ children: React.ReactNode }>;
  Tag?: React.ComponentType<{ tone: Tone; children: React.ReactNode }>;
}) {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);
  const currency = useUserStore((s) => s.profile.currency);

  useEffect(() => {
    if (!clients.length) refresh();
  }, [clients.length, refresh]);

  const top = useMemo(() => {
    const toneForStatus = (status: string): Tone => {
      if (status === "at_risk") return "danger";
      if (status === "inactive") return "warning";
      return "success";
    };

    const rank = (status: string) => {
      const tone = toneForStatus(status);
      if (tone === "danger") return 0;
      if (tone === "warning") return 1;
      return 2;
    };

    return [...clients]
      .sort((a, b) => rank(a.status) - rank(b.status))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        tone: toneForStatus(c.status),
        lastInvoiceAmount: c.lastInvoiceAmount,
      }));
  }, [clients]);

  const Strong = StrongText ?? Text;
  const WrapRow = Row;
  const WrapTag = Tag;

  const labelFor = (status: string) => {
    if (status === "at_risk") return "At risk";
    if (status === "inactive") return "Inactive";
    return "Active";
  };

  const countAtRisk = useMemo(
    () => clients.filter((c) => c.status === "at_risk").length,
    [clients]
  );

  return (
    <>
      <Text>{countAtRisk} at-risk clients</Text>
      {top.map((c) => (
        <React.Fragment key={c.id}>
          {WrapRow && WrapTag ? (
            <WrapRow>
              <WrapTag tone={c.tone}>{labelFor(c.status)}</WrapTag>
              <Strong>{c.name}</Strong>
            </WrapRow>
          ) : (
            <Text>
              • {labelFor(c.status)}: {c.name}
            </Text>
          )}
          <Text>Last invoice: {formatCurrency(c.lastInvoiceAmount, currency)}</Text>
        </React.Fragment>
      ))}
    </>
  );
}
