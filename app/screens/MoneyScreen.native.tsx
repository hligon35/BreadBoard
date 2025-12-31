import React, { useEffect, useState } from "react";
import { Button, Card, Container, Donut, H1, Muted, Row, Screen, Scroll, SparkLine, StackedBars, Tabs } from "@ui/native";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { formatCurrency } from "@app/utils/format";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";

const moneyTabs = [
  { key: "overview", label: "Overview" },
  { key: "income", label: "Income" },
  { key: "expenses", label: "Expenses" },
  { key: "mileage", label: "Mileage & Time" },
  { key: "taxes", label: "Taxes" },
  { key: "budgets", label: "Budgets" },
];

export function MoneyScreen() {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const incomeTransactions = useMoneyStore((s) => s.incomeTransactions);
  const expenseTransactions = useMoneyStore((s) => s.expenseTransactions);
  const budgets = useMoneyStore((s) => s.budgets);
  const cashFlow = useMoneyStore((s) => s.cashFlow);
  const overview = useMoneyStore((s) => s.overview);
  const tasks = useWorkStore((s) => s.tasks);
  const complianceOverview = useComplianceStore((s) => s.overview);
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

          {tab === "overview" && (
            <Card>
              <Muted>Cash flow (recent)</Muted>
              <StackedBars seriesA={cashFlow.map((p) => p.inflow)} seriesB={cashFlow.map((p) => p.outflow)} />
            </Card>
          )}
          {tab === "income" && (
            <>
              <Card>
                <Muted>Income trend</Muted>
                <SparkLine values={cashFlow.map((p) => p.inflow)} />
              </Card>
              <Card>
                <Muted>Income transactions</Muted>
                {incomeTransactions.map((t) => (
                  <Card key={t.id}>
                    <Muted>
                      {new Date(t.date).toLocaleDateString()} • {t.client ?? "—"} • {t.memo ?? "—"}
                    </Muted>
                    <Muted>{formatCurrency(t.amount, currency)}</Muted>
                  </Card>
                ))}
                {incomeTransactions.length === 0 && <Muted>No income transactions</Muted>}
              </Card>
            </>
          )}
          {tab === "expenses" && (
            <>
              <Card>
                <Muted>Expense trend</Muted>
                <SparkLine values={cashFlow.map((p) => p.outflow)} />
              </Card>
              <Card>
                <Muted>Expense transactions</Muted>
                {expenseTransactions.map((t) => (
                  <Card key={t.id}>
                    <Muted>
                      {new Date(t.date).toLocaleDateString()} • {t.vendor ?? "—"} • {t.category ?? "—"}
                    </Muted>
                    <Muted>{t.memo ?? "—"}</Muted>
                    <Muted>{formatCurrency(t.amount, currency)}</Muted>
                  </Card>
                ))}
                {expenseTransactions.length === 0 && <Muted>No expense transactions</Muted>}
              </Card>
            </>
          )}
          {tab === "mileage" && (
            <>
              <Card>
                <Muted>Workload mix</Muted>
                {(() => {
                  const open = tasks.filter((t) => t.status === "open").length;
                  const blocked = tasks.filter((t) => t.status === "blocked").length;
                  const done = tasks.filter((t) => t.status === "done").length;
                  const total = Math.max(1, open + blocked + done);
                  return (
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Donut value={done} total={total} />
                      <Card>
                        <Muted>Open: {open}</Muted>
                        <Muted>Blocked: {blocked}</Muted>
                        <Muted>Done: {done}</Muted>
                      </Card>
                    </Row>
                  );
                })()}
              </Card>
            </>
          )}
          {tab === "taxes" && (
            <>
              <Card>
                <Muted>Tax reserve vs estimate</Muted>
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Donut
                    value={overview?.taxReserve ?? 0}
                    total={complianceOverview?.estimatedTaxDue ?? Math.max(1, overview?.taxReserve ?? 1)}
                  />
                  <Card>
                    <Muted>Reserve: {overview ? formatCurrency(overview.taxReserve, currency) : "—"}</Muted>
                    <Muted>
                      Estimated due: {complianceOverview ? formatCurrency(complianceOverview.estimatedTaxDue, currency) : "—"}
                    </Muted>
                    <Muted>Paid: {complianceOverview ? formatCurrency(complianceOverview.estimatedTaxPaid, currency) : "—"}</Muted>
                  </Card>
                </Row>
              </Card>
            </>
          )}
          {tab === "budgets" && (
            <>
              <Card>
                <Muted>Budget utilization (spent)</Muted>
                <SparkLine values={budgets.map((b) => b.spent)} />
              </Card>
              <Card>
                <Muted>Budgets</Muted>
                {budgets.map((b) => {
                  const remaining = Math.max(0, b.limit - b.spent);
                  return (
                    <Card key={b.category}>
                      <Muted>{b.category}</Muted>
                      <Muted>
                        Budget: {formatCurrency(b.limit, currency)} • Spent: {formatCurrency(b.spent, currency)} • Remaining:{" "}
                        {formatCurrency(remaining, currency)}
                      </Muted>
                    </Card>
                  );
                })}
                {budgets.length === 0 && <Muted>No budgets</Muted>}
              </Card>
            </>
          )}
        </Container>
      </Scroll>
    </Screen>
  );
}
