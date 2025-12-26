import React, { useEffect, useMemo, useState } from "react";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

type CashFlowPoint = { label: string; inflow: number; outflow: number };

type Period = "Monthly" | "Quarterly";

type StatTone = "neutral" | "success" | "danger";

type ButtonLike = React.ComponentType<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}>;

type RowLike = React.ComponentType<{ children: React.ReactNode }>;

type TapLike = React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;

type FullScreenLike = React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;

type StatPillLike = React.ComponentType<{
  label: string;
  value: string;
  tone?: StatTone;
  hint?: string;
  inline?: boolean;
  badge?: string;
}>;

export function CashFlowWidget({
  Text,
  StrongText,
  Chart,
  Button,
  Row,
  Tap,
  FullScreen,
  StatPill,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Chart?: React.ComponentType<{
    points: CashFlowPoint[];
    compact?: boolean;
    showZones?: boolean;
    forecastNet?: Array<{ label: string; value: number }>;
  }>;
  Button?: ButtonLike;
  Row?: RowLike;
  Tap?: TapLike;
  FullScreen?: FullScreenLike;
  StatPill?: StatPillLike;
}) {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const points = useMoneyStore((s) => s.cashFlow);

  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("Monthly");

  useEffect(() => {
    if (!points.length) refresh();
  }, [points.length, refresh]);

  const viewPoints = useMemo(() => {
    if (!points.length) return points;
    if (period === "Quarterly") return points.slice(-8);
    return points.slice(-4);
  }, [points, period]);

  const netSeries = useMemo(() => viewPoints.map((p) => p.inflow - p.outflow), [viewPoints]);

  const totalIn = useMemo(() => viewPoints.reduce((sum, p) => sum + p.inflow, 0), [viewPoints]);
  const totalOut = useMemo(() => viewPoints.reduce((sum, p) => sum + p.outflow, 0), [viewPoints]);
  const net = useMemo(() => totalIn - totalOut, [totalIn, totalOut]);

  const netLabel = formatCurrency(net, currency);
  const netTone: StatTone = net >= 0 ? "success" : "danger";

  const trend = useMemo(() => {
    if (points.length < 8) return null;
    const last4 = points.slice(-4);
    const prev4 = points.slice(-8, -4);
    const sumNet = (xs: CashFlowPoint[]) => xs.reduce((s, p) => s + (p.inflow - p.outflow), 0);
    const cur = sumNet(last4);
    const prev = sumNet(prev4);
    if (Math.abs(prev) < 1) return null;
    const pct = ((cur - prev) / Math.abs(prev)) * 100;
    return pct;
  }, [points]);

  const trendText = trend == null ? "—" : `${trend >= 0 ? "↑" : "↓"} ${Math.round(Math.abs(trend))}% from last month`;
  const trendTone: StatTone = trend == null ? "neutral" : trend >= 0 ? "success" : "danger";

  const trendBadge = useMemo(() => {
    if (trend == null) return undefined;
    return `${trend >= 0 ? "↑" : "↓"} ${Math.round(Math.abs(trend))}%`;
  }, [trend]);

  const forecastNet = useMemo(() => {
    if (netSeries.length < 3) return [] as Array<{ label: string; value: number }>;
    const a = netSeries[netSeries.length - 3];
    const b = netSeries[netSeries.length - 2];
    const c = netSeries[netSeries.length - 1];
    const slope = (c - a) / 2;
    const next1 = c + slope;
    const next2 = next1 + slope;
    return [
      { label: "F1", value: next1 },
      { label: "F2", value: next2 },
    ];
  }, [netSeries]);

  if (!points.length) return <Text>Loading…</Text>;

  const ValueText = StrongText ?? Text;

  const Dashboard = (
    <>
      {Chart ? <Chart points={viewPoints} compact /> : null}
      {StatPill ? (
        Row ? (
          <Row>
            <StatPill label="In" value={formatCurrency(totalIn, currency)} tone="success" />
            <StatPill label="Out" value={formatCurrency(totalOut, currency)} tone="danger" />
            <StatPill
              label="Net"
              value={netLabel}
              tone={netTone}
              badge={trendBadge}
            />
          </Row>
        ) : (
          <>
            <StatPill label="In" value={formatCurrency(totalIn, currency)} tone="success" />
            <StatPill label="Out" value={formatCurrency(totalOut, currency)} tone="danger" />
            <StatPill
              label="Net"
              value={netLabel}
              tone={netTone}
              badge={trendBadge}
            />
          </>
        )
      ) : (
        <>
          <Text>In: {formatCurrency(totalIn, currency)}</Text>
          <Text>Out: {formatCurrency(totalOut, currency)}</Text>
          <ValueText>Net: {netLabel}</ValueText>
          <Text>{trendText}</Text>
        </>
      )}
    </>
  );

  const Filters =
    Row && Button && StatPill ? (
      <>
        <Row>
          <Button title="Monthly" variant={period === "Monthly" ? "primary" : "ghost"} onPress={() => setPeriod("Monthly")} />
          <Button title="Quarterly" variant={period === "Quarterly" ? "primary" : "ghost"} onPress={() => setPeriod("Quarterly")} />
        </Row>
        <Row>
          <StatPill label="Category" value="All" tone="neutral" />
          <StatPill label="Client" value="All" tone="neutral" />
          <StatPill label="Trend" value={trendText} tone={trendTone} />
        </Row>
      </>
    ) : null;

  const Full = (
    <>
      {Filters}
      {Chart ? <Chart points={viewPoints} showZones forecastNet={forecastNet} /> : null}
      {StatPill ? (
        <>
          <StatPill label="Inflow" value={formatCurrency(totalIn, currency)} tone="success" />
          <StatPill label="Outflow" value={formatCurrency(totalOut, currency)} tone="danger" />
          <StatPill label="Net Flow" value={netLabel} tone={netTone} />
        </>
      ) : (
        <>
          <Text>Inflow: {formatCurrency(totalIn, currency)}</Text>
          <Text>Outflow: {formatCurrency(totalOut, currency)}</Text>
          <ValueText>Net Flow: {netLabel}</ValueText>
        </>
      )}
    </>
  );

  return (
    <>
      {Tap && FullScreen ? <Tap onPress={() => setOpen(true)}>{Dashboard}</Tap> : Dashboard}
      {FullScreen ? (
        <FullScreen
          open={open}
          onClose={() => setOpen(false)}
          title="Cash Flow"
        >
          {Full}
        </FullScreen>
      ) : null}
    </>
  );
}
