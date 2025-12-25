import React, { useEffect } from "react";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

type CashFlowPoint = { label: string; inflow: number; outflow: number };

export function CashFlowWidget({
  Text,
  Chart,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  Chart?: React.ComponentType<{ points: CashFlowPoint[] }>;
}) {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const points = useMoneyStore((s) => s.cashFlow);

  useEffect(() => {
    if (!points.length) refresh();
  }, [points.length, refresh]);

  if (!points.length) return <Text>Loading…</Text>;

  const totalIn = points.reduce((sum, p) => sum + p.inflow, 0);
  const totalOut = points.reduce((sum, p) => sum + p.outflow, 0);
  const net = totalIn - totalOut;

  return (
    <>
      {Chart ? <Chart points={points} /> : null}
      <Text>Next period inflow: {formatCurrency(totalIn, currency)}</Text>
      <Text>Next period outflow: {formatCurrency(totalOut, currency)}</Text>
      <Text>Projected net: {formatCurrency(net, currency)}</Text>
    </>
  );
}
