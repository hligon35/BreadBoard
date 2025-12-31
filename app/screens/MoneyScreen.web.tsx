import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Card, Col, Donut, H1, Muted, Row, SparkLine, StackedBars, Tabs } from "@ui/web";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { formatCurrency } from "@app/utils/format";
import { useUserStore } from "@app/context/stores/useUserStore";
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

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const Flex = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
`;

export function MoneyScreen() {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const overview = useMoneyStore((s) => s.overview);
  const incomeTransactions = useMoneyStore((s) => s.incomeTransactions);
  const expenseTransactions = useMoneyStore((s) => s.expenseTransactions);
  const budgets = useMoneyStore((s) => s.budgets);
  const cashFlow = useMoneyStore((s) => s.cashFlow);
  const tasks = useWorkStore((s) => s.tasks);
  const complianceOverview = useComplianceStore((s) => s.overview);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    refresh();
  }, [refresh]);

  const headline = useMemo(() => {
    if (!overview) return "Loading mock data...";
    return `Profit YTD: ${formatCurrency(overview.profitYTD, currency)}`;
  }, [overview, currency]);

  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Money</H1>
        <Muted>{headline}</Muted>
      </div>

      <Tabs items={moneyTabs} activeKey={tab} onChange={setTab} />

      {tab === "overview" && (
        <Row style={{ alignItems: "stretch" }}>
          <Card style={{ flex: 1 }}>
            <Muted>Mock totals</Muted>
            <TopSpace>
              <Muted>Income YTD: {overview ? formatCurrency(overview.incomeYTD, currency) : "—"}</Muted>
              <Muted>Expenses YTD: {overview ? formatCurrency(overview.expensesYTD, currency) : "—"}</Muted>
              <Muted>Tax reserve: {overview ? formatCurrency(overview.taxReserve, currency) : "—"}</Muted>
            </TopSpace>
          </Card>
          <Flex $flex={2}>
            <Card>
              <Muted>Cash flow (recent)</Muted>
              <TopSpace>
                <StackedBars
                  seriesA={cashFlow.map((p) => p.inflow)}
                  seriesB={cashFlow.map((p) => p.outflow)}
                />
              </TopSpace>
            </Card>
          </Flex>
        </Row>
      )}

      {tab === "income" && (
        <Col>
          <Card>
            <Muted>Income trend</Muted>
            <TopSpace>
              <SparkLine values={cashFlow.map((p) => p.inflow)} />
            </TopSpace>
          </Card>
          <Card>
            <Muted>Income transactions</Muted>
            <TopSpace>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Date</th>
                    <th style={{ textAlign: "left" }}>Client</th>
                    <th style={{ textAlign: "left" }}>Memo</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>{t.client ?? "—"}</td>
                      <td>{t.memo ?? "—"}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(t.amount, currency)}</td>
                    </tr>
                  ))}
                  {incomeTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <Muted>No income transactions</Muted>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TopSpace>
          </Card>
        </Col>
      )}

      {tab === "expenses" && (
        <Col>
          <Card>
            <Muted>Expense trend</Muted>
            <TopSpace>
              <SparkLine values={cashFlow.map((p) => p.outflow)} />
            </TopSpace>
          </Card>
          <Card>
            <Muted>Expense transactions</Muted>
            <TopSpace>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Date</th>
                    <th style={{ textAlign: "left" }}>Vendor</th>
                    <th style={{ textAlign: "left" }}>Category</th>
                    <th style={{ textAlign: "left" }}>Memo</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>{t.vendor ?? "—"}</td>
                      <td>{t.category ?? "—"}</td>
                      <td>{t.memo ?? "—"}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(t.amount, currency)}</td>
                    </tr>
                  ))}
                  {expenseTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <Muted>No expense transactions</Muted>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TopSpace>
          </Card>
        </Col>
      )}

      {tab === "mileage" && (
        <Col>
          <Card>
            <Muted>Workload mix</Muted>
            <TopSpace>
              {(() => {
                const open = tasks.filter((t) => t.status === "open").length;
                const blocked = tasks.filter((t) => t.status === "blocked").length;
                const done = tasks.filter((t) => t.status === "done").length;
                const total = Math.max(1, open + blocked + done);
                return (
                  <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Donut value={done} total={total} />
                    <Col>
                      <Muted>Open: {open}</Muted>
                      <Muted>Blocked: {blocked}</Muted>
                      <Muted>Done: {done}</Muted>
                    </Col>
                  </Row>
                );
              })()}
            </TopSpace>
          </Card>
        </Col>
      )}

      {tab === "taxes" && (
        <Col>
          <Card>
            <Muted>Tax reserve vs estimate</Muted>
            <TopSpace>
              <Row style={{ alignItems: "center", justifyContent: "space-between" }}>
                <Donut
                  value={overview?.taxReserve ?? 0}
                  total={complianceOverview?.estimatedTaxDue ?? Math.max(1, overview?.taxReserve ?? 1)}
                />
                <Col>
                  <Muted>Reserve: {overview ? formatCurrency(overview.taxReserve, currency) : "—"}</Muted>
                  <Muted>
                    Estimated due: {complianceOverview ? formatCurrency(complianceOverview.estimatedTaxDue, currency) : "—"}
                  </Muted>
                  <Muted>
                    Paid: {complianceOverview ? formatCurrency(complianceOverview.estimatedTaxPaid, currency) : "—"}
                  </Muted>
                </Col>
              </Row>
            </TopSpace>
          </Card>
        </Col>
      )}

      {tab === "budgets" && (
        <Col>
          <Card>
            <Muted>Budget utilization (spent)</Muted>
            <TopSpace>
              <SparkLine values={budgets.map((b) => b.spent)} />
            </TopSpace>
          </Card>
          <Card>
            <Muted>Budgets</Muted>
            <TopSpace>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Category</th>
                    <th style={{ textAlign: "right" }}>Budget</th>
                    <th style={{ textAlign: "right" }}>Spent</th>
                    <th style={{ textAlign: "right" }}>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((b) => {
                    const remaining = Math.max(0, b.limit - b.spent);
                    return (
                      <tr key={b.category}>
                        <td>{b.category}</td>
                        <td style={{ textAlign: "right" }}>{formatCurrency(b.limit, currency)}</td>
                        <td style={{ textAlign: "right" }}>{formatCurrency(b.spent, currency)}</td>
                        <td style={{ textAlign: "right" }}>{formatCurrency(remaining, currency)}</td>
                      </tr>
                    );
                  })}
                  {budgets.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <Muted>No budgets</Muted>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TopSpace>
          </Card>
        </Col>
      )}
    </Col>
  );
}

