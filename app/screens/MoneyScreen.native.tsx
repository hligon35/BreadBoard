import React, { useEffect, useState } from "react";
import { Button, Card, ChartPlaceholder, Container, H1, Muted, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";

const moneyTabs = [
  { key: "overview", label: "Overview" },
  { key: "income", label: "Income" },
  { key: "expenses", label: "Expenses" },
  { key: "mileage", label: "Mileage & Time" },
  { key: "taxes", label: "Taxes" },
  { key: "budgets", label: "Budgets" },
];

export function MoneyScreen() {
  const refresh = useMoneyStore((s) => s.refresh);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Money</H1>
          <Tabs items={moneyTabs} activeKey={tab} onChange={setTab} />

          <Card>
            <Muted>Tab: {tab}</Muted>
            <Button title="Refresh (mock)" onPress={() => refresh()} />
          </Card>

          {tab === "overview" && <ChartPlaceholder title="Overview charts" />}
          {tab === "income" && (
            <>
              <ChartPlaceholder title="Income charts" />
              <TablePlaceholder title="Income transactions" />
            </>
          )}
          {tab === "expenses" && (
            <>
              <ChartPlaceholder title="Expense charts" />
              <TablePlaceholder title="Expense transactions" />
            </>
          )}
          {tab === "mileage" && (
            <>
              <ChartPlaceholder title="Mileage/time" />
              <TablePlaceholder title="Entries" />
            </>
          )}
          {tab === "taxes" && (
            <>
              <ChartPlaceholder title="Taxes" />
              <TablePlaceholder title="Checklist" />
            </>
          )}
          {tab === "budgets" && (
            <>
              <ChartPlaceholder title="Budgets" />
              <TablePlaceholder title="Budget rows" />
            </>
          )}
        </Container>
      </Scroll>
    </Screen>
  );
}
