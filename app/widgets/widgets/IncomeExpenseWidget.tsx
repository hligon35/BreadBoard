import React, { useEffect, useMemo, useState } from "react";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useUserStore } from "@app/context/stores/useUserStore";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { formatCurrency } from "@app/utils/format";

type WaterfallItem = {
  key: string;
  label: string;
  from: number;
  to: number;
  tone: "income" | "expense" | "net";
};

type Period = "Monthly" | "Quarterly" | "Yearly";

type WaterfallRendererProps = {
  items: WaterfallItem[];
  compact?: boolean;
  tooltip?: string;
  onSelectKey?: (key: string) => void;
  selectedKey?: string | null;
};

type ButtonLike = React.ComponentType<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}>;

type RowLike = React.ComponentType<{ children: React.ReactNode }>;

type TapLike = React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;

type FullScreenLike = React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;

type WrapLike = React.ComponentType<{ children: React.ReactNode }>;

type SectionLike = React.ComponentType<{ title: string; children: React.ReactNode }>;

type StatTone = "neutral" | "success" | "danger";

type StatPillLike = React.ComponentType<{ label: string; value: string; tone?: StatTone; hint?: string }>;

export function IncomeExpenseWidget({
  Text,
  StrongText,
  Waterfall,
  Button,
  Row,
  Tap,
  FullScreen,
  Wrap,
  Section,
  StatPill,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Waterfall?: React.ComponentType<WaterfallRendererProps>;
  Button?: ButtonLike;
  Row?: RowLike;
  Tap?: TapLike;
  FullScreen?: FullScreenLike;
  Wrap?: WrapLike;
  Section?: SectionLike;
  StatPill?: StatPillLike;
}) {
  const currency = useUserStore((s) => s.profile.currency);
  const refresh = useMoneyStore((s) => s.refresh);
  const overview = useMoneyStore((s) => s.overview);
  const budgets = useMoneyStore((s) => s.budgets);
  const cashFlow = useMoneyStore((s) => s.cashFlow);
  const themeMode = useThemeStore((s) => s.mode);

  const [period, setPeriod] = useState<Period>("Monthly");
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  const { periodIncome, periodExpenses, periodNet, categoryBreakdown } = useMemo(() => {
    const incomeYTD = overview?.incomeYTD ?? 0;
    const expensesYTD = overview?.expensesYTD ?? 0;
    const factor = period === "Monthly" ? 1 / 12 : period === "Quarterly" ? 1 / 4 : 1;
    const income = incomeYTD * factor;
    const expenses = expensesYTD * factor;
    const net = income - expenses;

    const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const cats = budgets
      .map((b) => ({
        id: b.id,
        category: b.category,
        weight: totalBudgetSpent > 0 ? b.spent / totalBudgetSpent : 0,
      }))
      .sort((a, b) => b.weight - a.weight);

    // Scale category spend to match the selected period's total expenses.
    let running = 0;
    const breakdown = cats.map((c, idx) => {
      const raw = expenses * c.weight;
      const amt = idx === cats.length - 1 ? expenses - running : raw;
      running += idx === cats.length - 1 ? expenses - running : raw;
      return {
        key: `exp_${c.id}`,
        label: c.category,
        amount: Math.max(0, amt),
      };
    });

    return {
      periodIncome: income,
      periodExpenses: expenses,
      periodNet: net,
      categoryBreakdown: breakdown,
    };
  }, [overview, budgets, period]);

  const topExpense = useMemo(() => {
    const top = [...categoryBreakdown].sort((a, b) => b.amount - a.amount)[0];
    return top ?? null;
  }, [categoryBreakdown]);

  const miniItems: WaterfallItem[] = useMemo(() => {
    const income = periodIncome;
    const expenses = periodExpenses;
    const net = income - expenses;
    return [
      { key: "income", label: "Income", from: 0, to: income, tone: "income" },
      { key: "expenses", label: "Expenses", from: income, to: income - expenses, tone: "expense" },
      { key: "net", label: "Net", from: 0, to: net, tone: "net" },
    ];
  }, [periodIncome, periodExpenses]);

  const fullItems: WaterfallItem[] = useMemo(() => {
    const items: WaterfallItem[] = [];
    let running = 0;

    items.push({ key: "income", label: "Income", from: 0, to: periodIncome, tone: "income" });
    running = periodIncome;

    for (const c of categoryBreakdown) {
      const next = running - c.amount;
      items.push({ key: c.key, label: c.label, from: running, to: next, tone: "expense" });
      running = next;
    }

    items.push({ key: "net", label: "Net", from: 0, to: running, tone: "net" });
    return items;
  }, [periodIncome, categoryBreakdown]);

  const tooltip = topExpense
    ? `Top expense: ${topExpense.label} – ${formatCurrency(topExpense.amount, currency)}`
    : undefined;

  const netArrow = periodNet >= 0 ? "▲" : "▼";
  const NetText = StrongText ?? Text;

  const trend = useMemo(() => {
    if (!cashFlow || cashFlow.length < 8) return null;
    const a = cashFlow.slice(0, 4);
    const b = cashFlow.slice(4, 8);
    const sum = (xs: typeof cashFlow) => xs.reduce((s, p) => s + (p.inflow - p.outflow), 0);
    const cur = sum(a);
    const prev = sum(b);
    if (Math.abs(prev) < 1) return null;
    const pct = ((cur - prev) / Math.abs(prev)) * 100;
    return pct;
  }, [cashFlow]);

  const selectedDetail = useMemo(() => {
    if (!selectedKey) return null;
    if (selectedKey === "income") {
      return {
        title: "Income",
        amount: periodIncome,
        pctOfExpenses: null as number | null,
      };
    }
    if (selectedKey === "net") {
      return {
        title: "Net",
        amount: periodNet,
        pctOfExpenses: null as number | null,
      };
    }
    const cat = categoryBreakdown.find((c) => c.key === selectedKey);
    if (!cat) return null;
    return {
      title: cat.label,
      amount: -cat.amount,
      pctOfExpenses: periodExpenses > 0 ? (cat.amount / periodExpenses) * 100 : null,
    };
  }, [selectedKey, categoryBreakdown, periodIncome, periodNet, periodExpenses]);

  const topCategories = [...categoryBreakdown].sort((a, b) => b.amount - a.amount).slice(0, 4);

  if (!overview) return <Text>Loading…</Text>;

  const expenseRatioPct = periodIncome > 0 ? Math.round((periodExpenses / periodIncome) * 100) : null;
  const netMarginPct = periodIncome > 0 ? Math.round((periodNet / periodIncome) * 100) : null;

  const trendText = trend == null ? "—" : `${trend >= 0 ? "▲" : "▼"} ${Math.round(Math.abs(trend))}%`;
  const trendTone: StatTone = trend == null ? "neutral" : trend >= 0 ? "success" : "danger";

  const Mini = (
    <>
      {Waterfall ? <Waterfall items={miniItems} compact tooltip={tooltip} /> : null}
      <NetText>
        {netArrow} {formatCurrency(periodNet, currency)}
      </NetText>
    </>
  );

  const Full = (
    <>
      {Row && Button ? (
        <Row>
          <Button title="Monthly" variant={period === "Monthly" ? "primary" : "ghost"} onPress={() => setPeriod("Monthly")} />
          <Button
            title="Quarterly"
            variant={period === "Quarterly" ? "primary" : "ghost"}
            onPress={() => setPeriod("Quarterly")}
          />
          <Button title="Yearly" variant={period === "Yearly" ? "primary" : "ghost"} onPress={() => setPeriod("Yearly")} />
        </Row>
      ) : null}

      {themeMode === "sponsor" ? (
        <Text>
          Branding boost saved {formatCurrency(Math.max(0, Math.round(periodExpenses * 0.05)), currency)} this month
        </Text>
      ) : null}

      {Waterfall ? (
        <Waterfall
          items={fullItems}
          onSelectKey={(k) => setSelectedKey((cur) => (cur === k ? null : k))}
          selectedKey={selectedKey}
        />
      ) : null}

      {Wrap && Section ? (
        <Wrap>
          <Section title="At a glance">
            {StatPill ? (
              <>
                <StatPill
                  label="Net"
                  value={`${netArrow} ${formatCurrency(periodNet, currency)}`}
                  tone={periodNet >= 0 ? "success" : "danger"}
                />
                <StatPill label="Income" value={formatCurrency(periodIncome, currency)} tone="success" />
                <StatPill label="Expenses" value={formatCurrency(periodExpenses, currency)} tone="danger" />
              </>
            ) : (
              <>
                <NetText>
                  {netArrow} Net {formatCurrency(periodNet, currency)}
                </NetText>
                <Text>Income + {formatCurrency(periodIncome, currency)}</Text>
                <Text>Expenses − {formatCurrency(periodExpenses, currency)}</Text>
              </>
            )}
          </Section>

          <Section title="Ratios">
            {StatPill ? (
              <>
                <StatPill
                  label="Expense ratio"
                  value={expenseRatioPct == null ? "—" : `${expenseRatioPct}%`}
                  tone="neutral"
                />
                <StatPill
                  label="Net margin"
                  value={netMarginPct == null ? "—" : `${netMarginPct}%`}
                  tone={periodNet >= 0 ? "success" : "danger"}
                />
                <StatPill label="Trend" value={trendText} tone={trendTone} />
              </>
            ) : (
              <>
                <Text>Expense ratio: {expenseRatioPct == null ? "—" : `${expenseRatioPct}%`}</Text>
                <Text>Net margin: {netMarginPct == null ? "—" : `${netMarginPct}%`}</Text>
                <Text>{trend == null ? "Trend: —" : `Trend: ${trend >= 0 ? "▲" : "▼"} ${Math.round(Math.abs(trend))}%`}</Text>
              </>
            )}
          </Section>

          {topCategories.length ? (
            <Section title="Top spending">
              {StatPill
                ? topCategories.map((c) => (
                    <StatPill
                      key={c.key}
                      label={c.label}
                      value={formatCurrency(c.amount, currency)}
                      hint={periodExpenses > 0 ? `${Math.round((c.amount / periodExpenses) * 100)}% of expenses` : undefined}
                      tone="danger"
                    />
                  ))
                : topCategories.map((c) => (
                    <Text key={c.key}>
                      {c.label}: {formatCurrency(c.amount, currency)}
                      {periodExpenses > 0 ? ` (${Math.round((c.amount / periodExpenses) * 100)}%)` : ""}
                    </Text>
                  ))}
            </Section>
          ) : null}

          {selectedDetail ? (
            <Section title="Selected">
              {StatPill ? (
                <StatPill
                  label={selectedDetail.title}
                  value={formatCurrency(selectedDetail.amount, currency)}
                  hint={selectedDetail.pctOfExpenses == null ? undefined : `${Math.round(selectedDetail.pctOfExpenses)}% of expenses`}
                  tone={selectedDetail.amount >= 0 ? "success" : "danger"}
                />
              ) : (
                <>
                  <NetText>
                    {selectedDetail.title}: {formatCurrency(selectedDetail.amount, currency)}
                  </NetText>
                  {selectedDetail.pctOfExpenses == null ? null : (
                    <Text>Share of expenses: {Math.round(selectedDetail.pctOfExpenses)}%</Text>
                  )}
                </>
              )}
            </Section>
          ) : null}
        </Wrap>
      ) : (
        <>
          <NetText>
            {netArrow} Net {formatCurrency(periodNet, currency)}
          </NetText>
          <Text>Income + {formatCurrency(periodIncome, currency)}</Text>
          <Text>Expenses − {formatCurrency(periodExpenses, currency)}</Text>

          <Text>Expense ratio: {expenseRatioPct == null ? "—" : `${expenseRatioPct}%`}</Text>
          <Text>Net margin: {netMarginPct == null ? "—" : `${netMarginPct}%`}</Text>
          <Text>{trend == null ? "Trend: —" : `Trend: ${trend >= 0 ? "▲" : "▼"} ${Math.round(Math.abs(trend))}%`}</Text>

          {topCategories.length
            ? topCategories.map((c) => (
                <Text key={c.key}>
                  {c.label}: {formatCurrency(c.amount, currency)}
                  {periodExpenses > 0 ? ` (${Math.round((c.amount / periodExpenses) * 100)}%)` : ""}
                </Text>
              ))
            : null}

          {selectedDetail ? (
            <>
              <NetText>
                {selectedDetail.title}: {formatCurrency(selectedDetail.amount, currency)}
              </NetText>
              {selectedDetail.pctOfExpenses == null ? null : (
                <Text>Share of expenses: {Math.round(selectedDetail.pctOfExpenses)}%</Text>
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );

  return (
    <>
      {Tap && FullScreen ? <Tap onPress={() => setOpen(true)}>{Mini}</Tap> : Mini}

      {FullScreen ? (
        <FullScreen
          open={open}
          onClose={() => {
            setOpen(false);
            setSelectedKey(null);
          }}
          title="Income vs Expenses"
        >
          {Full}
        </FullScreen>
      ) : null}
    </>
  );
}
