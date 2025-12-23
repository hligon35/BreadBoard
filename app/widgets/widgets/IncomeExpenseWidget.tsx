import React, { useEffect } from "react";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";

export function IncomeExpenseWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const overview = useMoneyStore((s) => s.overview);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  if (!overview) return <Text>Loading…</Text>;

  return (
    <>
      <Text>Income YTD: {formatCurrency(overview.incomeYTD, currency)}</Text>
      <Text>Expenses YTD: {formatCurrency(overview.expensesYTD, currency)}</Text>
      <Text>Profit YTD: {formatCurrency(overview.profitYTD, currency)}</Text>
    </>
  );
}
