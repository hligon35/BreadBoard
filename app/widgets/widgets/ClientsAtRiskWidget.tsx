import React, { useEffect, useMemo, useState } from "react";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

type Tone = "danger" | "warning" | "success";
type RiskLevel = "high" | "medium" | "low";

type ButtonLike = React.ComponentType<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}>;

type TapLike = React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;

type FullScreenLike = React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;

type WrapLike = React.ComponentType<{ children: React.ReactNode }>;
type SectionLike = React.ComponentType<{ title: string; children: React.ReactNode }>;

type StatTone = "neutral" | "success" | "danger";
type StatPillLike = React.ComponentType<{ label: string; value: string; tone?: StatTone; hint?: string }>;

export function ClientsAtRiskWidget({
  Text,
  StrongText,
  Row,
  Tag,
  Button,
  Tap,
  FullScreen,
  Wrap,
  Section,
  StatPill,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Row?: React.ComponentType<{ children: React.ReactNode }>;
  Tag?: React.ComponentType<{ tone: Tone; children: React.ReactNode }>;
  Button?: ButtonLike;
  Tap?: TapLike;
  FullScreen?: FullScreenLike;
  Wrap?: WrapLike;
  Section?: SectionLike;
  StatPill?: StatPillLike;
}) {
  const refresh = useClientsStore((s) => s.refresh);
  const clients = useClientsStore((s) => s.clients);
  const currency = useUserStore((s) => s.profile.currency);

  const [open, setOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "high_medium">("high_medium");
  const [dateFilter, setDateFilter] = useState<"30" | "90" | "all">("30");
  const [impactFilter, setImpactFilter] = useState<"all" | "high">("all");

  useEffect(() => {
    if (!clients.length) refresh();
  }, [clients.length, refresh]);

  const derived = useMemo(() => {
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

    const all = [...clients]
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
      .sort((a, b) => {
        const dr = rank(a.risk) - rank(b.risk);
        if (dr !== 0) return dr;
        return b.lastInvoiceAmount - a.lastInvoiceAmount;
      });

    const highOnly = all.filter((c) => c.risk === "high");
    const needsAttention = all.filter((c) => c.risk !== "low");

    return {
      all,
      highOnly,
      needsAttention,
    };
  }, [clients]);

  const Strong = StrongText ?? Text;
  const WrapRow = Row;
  const WrapTag = Tag;

  const labelForRisk = (risk: RiskLevel) => {
    if (risk === "high") return "High";
    if (risk === "medium") return "Medium";
    return "Low";
  };

  const atRiskCount = derived.highOnly.length;
  const top2 = derived.highOnly.slice(0, 2);
  const moreCount = Math.max(0, atRiskCount - top2.length);

  const meter = useMemo(() => {
    // Exactly 3 squares (no extra highlight square).
    return ["🟥", "🟨", "🟩"].join(" ");
  }, [clients.length, atRiskCount]);

  const applyFilters = useMemo(() => {
    const windowDays = dateFilter === "30" ? 30 : dateFilter === "90" ? 90 : Number.POSITIVE_INFINITY;
    const impactThreshold = 2000;
    return derived.needsAttention.filter((c) => {
      if (riskFilter === "high" && c.risk !== "high") return false;
      if (riskFilter === "high_medium" && c.risk === "low") return false;
      if (impactFilter === "high" && c.lastInvoiceAmount < impactThreshold) return false;

      // Optional mock-derived signal: if store doesn't have dates, treat as unknown and keep.
      const lastTouchDaysAgo = (clients.find((x) => x.id === c.id) as any)?.lastTouchDaysAgo as number | undefined;
      if (typeof lastTouchDaysAgo === "number" && lastTouchDaysAgo > windowDays) return false;
      return true;
    });
  }, [clients, dateFilter, derived.needsAttention, impactFilter, riskFilter]);

  const aiSuggestionFor = (risk: RiskLevel, reason?: string) => {
    const r = (reason ?? "").toLowerCase();
    if (r.includes("late") || r.includes("overdue")) return "Send a payment reminder + offer ACH/autopay.";
    if (r.includes("dispute")) return "Review dispute notes and schedule a 10‑min call.";
    if (r.includes("renewal")) return "Send renewal proposal with a clear timeline.";
    if (r.includes("engagement") || r.includes("activity") || r.includes("stalled"))
      return "Share a progress recap + propose next steps.";
    return risk === "high" ? "Escalate with an outreach sequence." : "Nudge with a friendly check‑in.";
  };

  const canFullScreen = !!Tap && !!FullScreen;

  const cycleRisk = () => setRiskFilter((v) => (v === "high_medium" ? "high" : v === "high" ? "all" : "high_medium"));
  const cycleDate = () => setDateFilter((v) => (v === "30" ? "90" : v === "90" ? "all" : "30"));
  const cycleImpact = () => setImpactFilter((v) => (v === "all" ? "high" : "all"));

  const DashboardContent = Wrap ? (
    <Wrap>
      {top2.map((c) => (
        <React.Fragment key={c.id}>
          {WrapRow && WrapTag ? (
            <WrapRow>
              <WrapTag tone={c.tone}>{labelForRisk(c.risk)}</WrapTag>
              <Strong>
                {c.risk === "high" ? "⚠️" : "•"} {c.name}
              </Strong>
            </WrapRow>
          ) : (
            <Text>
              • {labelForRisk(c.risk)}: {c.name}
            </Text>
          )}
        </React.Fragment>
      ))}
      {moreCount ? <Text>+{moreCount} more</Text> : null}
    </Wrap>
  ) : (
    <>
      {top2.map((c) => (
        <Text key={c.id}>• {c.name}</Text>
      ))}
      {moreCount ? <Text>+{moreCount} more</Text> : null}
    </>
  );

  return (
    <>
      {canFullScreen ? (
        <Tap onPress={() => setOpen(true)}>
          {DashboardContent}
        </Tap>
      ) : (
        DashboardContent
      )}

      {FullScreen ? (
        <FullScreen open={open} onClose={() => setOpen(false)} title="Clients at Risk">
          {Wrap && Section && StatPill ? (
            <Wrap>
              <Section title="Overview">
                <StatPill label="Clients at risk" value={`${atRiskCount}`} tone={atRiskCount ? "danger" : "neutral"} hint="High risk" />
                <StatPill
                  label="Needs attention"
                  value={`${derived.needsAttention.length}`}
                  tone={derived.needsAttention.length ? "danger" : "neutral"}
                  hint="High + Medium"
                />
              </Section>

              <Section title="Filters">
                <Text>Risk: {riskFilter === "high" ? "High" : riskFilter === "high_medium" ? "High + Medium" : "All"}</Text>
                <Text>Date: {dateFilter === "30" ? "Last 30 days" : dateFilter === "90" ? "Last 90 days" : "All time"}</Text>
                <Text>Revenue impact: {impactFilter === "high" ? "High" : "All"}</Text>
                {Button ? (
                  <>
                    <Button title="Risk" variant="ghost" onPress={cycleRisk} />
                    <Button title="Date" variant="ghost" onPress={cycleDate} />
                    <Button title="Impact" variant="ghost" onPress={cycleImpact} />
                  </>
                ) : null}
              </Section>

              <Section title="Heat List">
                {applyFilters.length ? (
                  applyFilters.map((c) => (
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
                      {c.reason ? <Text>{c.reason}</Text> : <Text>—</Text>}
                      <Text>Revenue impact: {formatCurrency(c.lastInvoiceAmount, currency)}</Text>
                    </React.Fragment>
                  ))
                ) : (
                  <Text>No clients match these filters.</Text>
                )}
              </Section>

              <Section title="AI Suggestions">
                {applyFilters.slice(0, 3).map((c) => (
                  <React.Fragment key={`ai_${c.id}`}>
                    <Strong>{c.name}</Strong>
                    <Text>{aiSuggestionFor(c.risk, c.reason)}</Text>
                  </React.Fragment>
                ))}
              </Section>

              <Text>CRM boost reduced churn by 18%</Text>
            </Wrap>
          ) : (
            <>
              <Text>Clients at risk: {atRiskCount}</Text>
              <Text>{meter}</Text>
            </>
          )}
        </FullScreen>
      ) : null}
    </>
  );
}
