import React, { useEffect, useMemo } from "react";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

type Tone = "danger" | "warning" | "success";
type RiskLevel = "high" | "medium" | "low";

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
    const riskFor = (status: string, riskLevel?: RiskLevel): RiskLevel => {
      if (riskLevel) return riskLevel;
      if (status === "at_risk") return "high";
      if (status === "inactive") return "medium";
      return "low";
    };

    const toneForRisk = (risk: RiskLevel): Tone => {
      if (risk === "high") return "danger";
      if (risk === "medium") return "warning";
      return "success";
    };

    const rank = (risk: RiskLevel) => (risk === "high" ? 0 : risk === "medium" ? 1 : 2);

    return [...clients]
      .map((c) => {
        const risk = riskFor(c.status, c.riskLevel);
        return {
          id: c.id,
          name: c.name,
          status: c.status,
          risk,
          tone: toneForRisk(risk),
          reason: c.riskReason,
          lastInvoiceAmount: c.lastInvoiceAmount,
        };
      })
      .filter((c) => c.risk !== "low")
      .sort((a, b) => {
        const dr = rank(a.risk) - rank(b.risk);
        if (dr !== 0) return dr;
        return b.lastInvoiceAmount - a.lastInvoiceAmount;
      })
      .slice(0, 4);
  }, [clients]);

  const Strong = StrongText ?? Text;
  const WrapRow = Row;
  const WrapTag = Tag;

  const labelForRisk = (risk: RiskLevel) => {
    if (risk === "high") return "High";
    if (risk === "medium") return "Medium";
    return "Low";
  };

  const needsAttentionCount = useMemo(() => {
    const riskFor = (status: string, riskLevel?: RiskLevel): RiskLevel => {
      if (riskLevel) return riskLevel;
      if (status === "at_risk") return "high";
      if (status === "inactive") return "medium";
      return "low";
    };
    return clients.filter((c) => riskFor(c.status, c.riskLevel) !== "low").length;
  }, [clients]);

  const moreCount = Math.max(0, needsAttentionCount - top.length);

  return (
    <>
      <Text>{needsAttentionCount ? `${needsAttentionCount} clients need attention` : "No clients need attention"}</Text>
      {top.map((c) => (
        <React.Fragment key={c.id}>
          {WrapRow && WrapTag ? (
            <WrapRow>
              <WrapTag tone={c.tone}>{labelForRisk(c.risk)}</WrapTag>
              <Strong>{c.name}</Strong>
            </WrapRow>
          ) : (
            <Text>
              • {labelForRisk(c.risk)}: {c.name}
            </Text>
          )}
          {c.reason ? <Text>{c.reason}</Text> : null}
          <Text>Last invoice: {formatCurrency(c.lastInvoiceAmount, currency)}</Text>
        </React.Fragment>
      ))}
      {moreCount ? <Text>+{moreCount} more</Text> : null}
    </>
  );
}
