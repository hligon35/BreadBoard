import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Card, Col, H1, Muted, Row, Tabs, ChartPlaceholder, TablePlaceholder } from "@ui/web";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { formatCurrency } from "@app/utils/format";
import { useUserStore } from "@app/context/stores/useUserStore";

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
            <ChartPlaceholder title="Overview charts" />
          </Flex>
        </Row>
      )}

      {tab === "income" && (
        <Col>
          <ChartPlaceholder title="Income charts" />
          <TablePlaceholder title="Income transactions" />
        </Col>
      )}

      {tab === "expenses" && (
        <Col>
          <ChartPlaceholder title="Expense charts" />
          <TablePlaceholder title="Expense transactions" />
        </Col>
      )}

      {tab === "mileage" && (
        <Col>
          <ChartPlaceholder title="Mileage & time charts" />
          <TablePlaceholder title="Mileage/time entries" />
        </Col>
      )}

      {tab === "taxes" && (
        <Col>
          <ChartPlaceholder title="Tax reserve & estimates" />
          <TablePlaceholder title="Tax checklist" />
        </Col>
      )}

      {tab === "budgets" && (
        <Col>
          <ChartPlaceholder title="Budget utilization" />
          <TablePlaceholder title="Budgets" />
        </Col>
      )}
    </Col>
  );
}

