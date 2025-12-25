import React, { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { Button, Muted, TopStack } from "@ui/web";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { widgetCatalog } from "./widgetTypes";
import type { WidgetLayoutItem, WidgetSize } from "./widgetTypes";
import { WidgetContainerWeb } from "./WidgetContainer.web";
import { IncomeExpenseWidget } from "./widgets/IncomeExpenseWidget";
import { TaxCountdownWidget } from "./widgets/TaxCountdownWidget";
import { ClientsAtRiskWidget } from "./widgets/ClientsAtRiskWidget";
import { ActiveProjectsWidget } from "./widgets/ActiveProjectsWidget";
import { MileageWidget } from "./widgets/MileageWidget";
import { CashFlowWidget } from "./widgets/CashFlowWidget";
import { AISuggestionsWidget } from "./widgets/AISuggestionsWidget";
import { BadgesWidget } from "./widgets/BadgesWidget";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const Clickable = styled.div`
  cursor: pointer;
`;

const Ring = styled.div<{ $deg: number; $color: string }>`
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $deg, $color }) => `conic-gradient(${$color} ${$deg}deg, ${theme.colors.border} 0deg)`};

  &::before {
    content: "";
    position: absolute;
    inset: 12px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const RingContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.05;
`;

const RingValueText = styled.div`
  font-weight: 700;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

const RingSubText = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: ${({ theme }) => theme.typography.base - 2}px;
`;

const MeterTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const MeterFill = styled.div<{ $w: number; $color: string }>`
  height: 100%;
  width: ${({ $w }) => $w}%;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const StrongText = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const StatWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StatCard = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  text-align: center;
`;

const StatBody = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StatPillWrap = styled.div`
  flex: 1 1 0;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatPillLabel = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
`;

const StatPillValue = styled.div<{ $tone?: "neutral" | "success" | "danger" }>`
  font-weight: 800;
  color: ${({ theme, $tone }) =>
    $tone === "success" ? theme.colors.success : $tone === "danger" ? theme.colors.danger : theme.colors.text};
  text-align: center;
`;

const StatPillHint = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ToneTag = styled.span<{ $tone: "danger" | "warning" | "success" }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  color: #fff;
  font-size: 12px;
  background: ${({ theme, $tone }) =>
    $tone === "danger" ? theme.colors.danger : $tone === "warning" ? theme.colors.warning : theme.colors.success};
`;

const BadgeShelfRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow-x: auto;
  padding-bottom: 2px;
`;

const BadgePill = styled.div`
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
`;

const WaterfallWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const WaterfallBars = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const WaterfallSlot = styled.div`
  flex: 1;
  min-width: 0;
`;

const WaterfallChart = styled.div`
  position: relative;
  height: 84px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const WaterfallBaseline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const WaterfallBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const WaterfallLabel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CashFlowWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  height: 96px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const CashFlowSvg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const KanbanRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const KanbanCol = styled.div`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const KanbanHeader = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  font-weight: 700;
`;

const KanbanCard = styled.div`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const KanbanCardTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KanbanCardMeta = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AiStackWrap = styled.div`
  position: relative;
  height: 150px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const AiCardBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
  user-select: none;
  touch-action: none;
`;

const AiTag = styled.div<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  color: #fff;
  font-size: 12px;
  background: ${({ $bg }) => $bg};
`;

const AiTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const AiDetail = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const AiActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.bg};
  z-index: 100;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const FullScreenInner = styled.div`
  width: min(980px, 100%);
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const TopChevronButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
`;

const TopChevronText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 800;
  line-height: 24px;
`;

function spanFor(size: WidgetSize) {
  if (size === "S") return 1;
  if (size === "M") return 2;
  return 3;
}

export function WidgetGridWeb({
  mode = "default",
}: {
  mode?: "default" | "move" | "delete";
}) {
  const layout = useDashboardStore((s) => s.preset.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const removeWidget = useDashboardStore((s) => s.removeWidget);

  const [dragId, setDragId] = useState<string | null>(null);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);
  const theme = useTheme();

  const Text = ({ children }: { children: React.ReactNode }) => <Muted>{children}</Muted>;
  const RingSub = ({ children }: { children: React.ReactNode }) => <RingSubText>{children}</RingSubText>;
  const RingValue = ({ children }: { children: React.ReactNode }) => <RingValueText>{children}</RingValueText>;

  const TaxRing = ({
    progress,
    tone,
    children,
  }: {
    progress: number;
    tone?: "success" | "warning" | "danger";
    children: React.ReactNode;
  }) => {
    const p = Math.max(0, Math.min(1, progress));
    const deg = Math.round(p * 360);
    const color = tone === "danger" ? theme.colors.danger : tone === "warning" ? theme.colors.warning : theme.colors.success;
    return (
      <Ring $deg={deg} $color={color}>
        <RingContent>{children}</RingContent>
      </Ring>
    );
  };

  const BadgesRing = ({ progress, children }: { progress: number; children: React.ReactNode }) => {
    const p = Math.max(0, Math.min(1, progress));
    const deg = Math.round(p * 360);
    return (
      <Ring $deg={deg} $color={theme.colors.category.insights}>
        <RingContent>{children}</RingContent>
      </Ring>
    );
  };

  const Row = ({ children }: { children: React.ReactNode }) => <InlineRow>{children}</InlineRow>;
  const Tap = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <Clickable
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onPress();
      }}
    >
      {children}
    </Clickable>
  );

  const FullScreen = ({
    open,
    onClose,
    children,
    title,
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
  }) => {
    if (!open) return null;
    return (
      <FullScreenOverlay onClick={onClose}>
        <FullScreenInner onClick={(e) => e.stopPropagation()}>
          <TopStack
            title={title ?? "Details"}
            left={
              <TopChevronButton
                role="button"
                tabIndex={0}
                onClick={onClose}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onClose();
                }}
                aria-label="Back"
              >
                <TopChevronText>‹</TopChevronText>
              </TopChevronButton>
            }
          />
          {children}
        </FullScreenInner>
      </FullScreenOverlay>
    );
  };

  const Wrap = ({ children }: { children: React.ReactNode }) => <StatWrap>{children}</StatWrap>;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <StatCard>
      <StatTitle>{title}</StatTitle>
      <StatBody>{children}</StatBody>
    </StatCard>
  );

  const StatPill = ({
    label,
    value,
    tone,
    hint,
  }: {
    label: string;
    value: string;
    tone?: "neutral" | "success" | "danger";
    hint?: string;
  }) => (
    <StatPillWrap>
      <StatPillLabel>{label}</StatPillLabel>
      <StatPillValue $tone={tone}>{value}</StatPillValue>
      {hint ? <StatPillHint>{hint}</StatPillHint> : null}
    </StatPillWrap>
  );
  const Tag = ({ tone, children }: { tone: "danger" | "warning" | "success"; children: React.ReactNode }) => (
    <ToneTag $tone={tone}>{children}</ToneTag>
  );

  const Meter = ({ progress, tone }: { progress: number; tone?: "success" | "warning" | "danger" }) => {
    const p = Math.max(0, Math.min(1, progress));
    const color =
      tone === "danger" ? theme.colors.danger : tone === "warning" ? theme.colors.warning : theme.colors.success;
    return (
      <MeterTrack aria-hidden="true">
        <MeterFill $w={Math.round(p * 100)} $color={color} />
      </MeterTrack>
    );
  };
  const Shelf = ({ children }: { children: React.ReactNode }) => <BadgeShelfRow>{children}</BadgeShelfRow>;
  const Pill = ({ label }: { label: string }) => <BadgePill>{label}</BadgePill>;

  const Waterfall = ({
    items,
    compact,
    tooltip,
    onSelectKey,
    selectedKey,
  }: {
    items: Array<{ key: string; label: string; from: number; to: number; tone: "income" | "expense" | "net" }>;
    compact?: boolean;
    tooltip?: string;
    onSelectKey?: (key: string) => void;
    selectedKey?: string | null;
  }) => {
    const values = items.flatMap((it) => [it.from, it.to, 0]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const H = compact ? 56 : 84;

    const yFor = (v: number) => ((max - v) / range) * H;
    const y0 = yFor(0);

    const colorFor = (tone: "income" | "expense" | "net", to: number) => {
      if (tone === "income") return theme.colors.success;
      if (tone === "expense") return theme.colors.danger;
      return theme.colors.border;
    };

    const interactive = !!onSelectKey;

    return (
      <WaterfallWrap title={tooltip}>
        <WaterfallBars>
          {items.map((it) => {
            const top = Math.min(yFor(it.from), yFor(it.to));
            const height = Math.max(2, Math.abs(yFor(it.from) - yFor(it.to)));
            const isSel = selectedKey === it.key;
            return (
              <WaterfallSlot key={it.key}>
                <WaterfallChart
                  style={{ height: H, cursor: interactive ? "pointer" : "default", outline: isSel ? `2px solid ${theme.colors.primary}` : "none" }}
                  onClick={() => onSelectKey?.(it.key)}
                >
                  <WaterfallBaseline style={{ top: y0 }} />
                  <WaterfallBar
                    style={{
                      top,
                      height,
                      background: colorFor(it.tone, it.to),
                    }}
                  />
                </WaterfallChart>
                <WaterfallLabel title={it.label}>{it.label}</WaterfallLabel>
              </WaterfallSlot>
            );
          })}
        </WaterfallBars>
      </WaterfallWrap>
    );
  };

  const CashFlowChart = ({ points }: { points: Array<{ label: string; inflow: number; outflow: number }> }) => {
    const W = 100;
    const H = 96;
    const P = 8;

    const maxV = Math.max(1, ...points.flatMap((p) => [p.inflow, p.outflow]));
    const xFor = (i: number) => {
      if (points.length <= 1) return P;
      const t = i / (points.length - 1);
      return P + t * (W - P * 2);
    };
    const yFor = (v: number) => P + (1 - v / maxV) * (H - P * 2);

    const pathFor = (key: "inflow" | "outflow") =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(2)},${yFor(p[key]).toFixed(2)}`)
        .join(" ");

    const areaFor = (key: "inflow" | "outflow") => {
      const top = points.map((p, i) => `${xFor(i).toFixed(2)},${yFor(p[key]).toFixed(2)}`).join(" L ");
      const bottomY = (H - P).toFixed(2);
      return `M${P},${bottomY} L ${top} L ${(W - P).toFixed(2)},${bottomY} Z`;
    };

    const inflow = theme.colors.success;
    const outflow = theme.colors.danger;

    return (
      <CashFlowWrap>
        <CashFlowSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={areaFor("inflow")} fill={inflow} opacity={0.14} />
          <path d={areaFor("outflow")} fill={outflow} opacity={0.12} />
          <path d={pathFor("inflow")} stroke={inflow} strokeWidth={2} fill="none" />
          <path d={pathFor("outflow")} stroke={outflow} strokeWidth={2} fill="none" />
        </CashFlowSvg>
      </CashFlowWrap>
    );
  };

  const Kanban = ({
    columns,
  }: {
    columns: Array<{
      key: "todo" | "doing" | "done";
      title: string;
      count: number;
      cards: Array<{ id: string; title: string; meta?: string }>;
    }>;
  }) => (
    <KanbanRow>
      {columns.map((col) => (
        <KanbanCol key={col.key}>
          <KanbanHeader>
            {col.title} • {col.count}
          </KanbanHeader>
          {col.cards.slice(0, 3).map((card) => (
            <KanbanCard key={card.id}>
              <KanbanCardTitle title={card.title}>{card.title}</KanbanCardTitle>
              {card.meta ? <KanbanCardMeta title={card.meta}>{card.meta}</KanbanCardMeta> : null}
            </KanbanCard>
          ))}
          {col.count > 3 ? <KanbanCardMeta>+{col.count - 3} more</KanbanCardMeta> : null}
        </KanbanCol>
      ))}
    </KanbanRow>
  );

  const renderWidget = (type: WidgetLayoutItem["type"]) => {
    switch (type) {
      case "IncomeExpense":
        return (
          <IncomeExpenseWidget
            Text={Text}
            StrongText={StrongText}
            Row={Row}
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
            Tap={Tap}
            FullScreen={FullScreen}
            Waterfall={Waterfall}
            Wrap={Wrap}
            Section={Section}
            StatPill={StatPill}
          />
        );
      case "TaxCountdown":
        return <TaxCountdownWidget Text={RingSub} ValueText={RingValue} ProgressRing={TaxRing} Meter={Meter} />;
      case "ClientsAtRisk":
        return <ClientsAtRiskWidget Text={Text} StrongText={StrongText} Row={Row} Tag={Tag} />;
      case "ActiveProjects":
        return <ActiveProjectsWidget Text={Text} StrongText={StrongText} Kanban={Kanban} />;
      case "Mileage":
        return <MileageWidget Text={Text} />;
      case "CashFlow":
        return <CashFlowWidget Text={Text} Chart={CashFlowChart} />;
      case "AISuggestions":
        return <AISuggestionsWidget Text={Text} StrongText={StrongText} CardStack={AiCardStack} />;
      case "Badges":
        return (
          <BadgesWidget
            Text={Text}
            StrongText={StrongText}
            ProgressRing={BadgesRing}
            BadgeShelf={Shelf}
            BadgePill={Pill}
          />
        );
    }
  };

  const AiCardStack = ({
    cards,
    onDo,
    onDismiss,
  }: {
    cards: Array<{ id: string; category: "Finance" | "Clients" | "Workflow"; title: string; detail: string; actionLabel: string }>;
    onDo: (id: string) => void;
    onDismiss: (id: string) => void;
  }) => {
    const top = cards[0];
    const second = cards[1];
    const third = cards[2];

    const colorForCategory = (cat: "Finance" | "Clients" | "Workflow") => {
      if (cat === "Finance") return theme.colors.category.money;
      if (cat === "Clients") return theme.colors.category.clients;
      return theme.colors.category.work;
    };

    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startRef = React.useRef<{ x: number } | null>(null);

    const reset = () => {
      setDragging(false);
      setDragX(0);
      startRef.current = null;
    };

    const commit = () => {
      const dx = dragX;
      const TH = 120;
      if (Math.abs(dx) < TH) {
        reset();
        return;
      }
      const id = top?.id;
      if (!id) {
        reset();
        return;
      }
      if (dx > 0) onDo(id);
      else onDismiss(id);
      reset();
    };

    const Card = ({
      card,
      offset,
      scale,
      rotate,
      interactive,
    }: {
      card: typeof top;
      offset: number;
      scale: number;
      rotate: number;
      interactive?: boolean;
    }) => {
      const transform = interactive
        ? `translateX(${dragX}px) rotate(${Math.max(-8, Math.min(8, dragX / 20))}deg)`
        : `translateY(${offset}px) scale(${scale}) rotate(${rotate}deg)`;

      return (
        <AiCardBase
          style={{
            top: offset,
            transform,
            opacity: interactive ? 1 : 0.92,
            cursor: interactive ? "grab" : "default",
            pointerEvents: interactive ? "auto" : "none",
          }}
          onPointerDown={(e) => {
            if (!interactive) return;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            startRef.current = { x: e.clientX };
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!interactive || !dragging || !startRef.current) return;
            setDragX(e.clientX - startRef.current.x);
          }}
          onPointerUp={() => {
            if (!interactive) return;
            commit();
          }}
          onPointerCancel={() => {
            if (!interactive) return;
            reset();
          }}
        >
          <AiTag $bg={colorForCategory(card.category)}>{card.category}</AiTag>
          <AiTitle>{card.title}</AiTitle>
          <AiDetail>{card.detail}</AiDetail>
          <AiActions>
            <Button variant="ghost" onClick={() => onDismiss(card.id)}>
              Later
            </Button>
            <Button variant="primary" onClick={() => onDo(card.id)}>
              {card.actionLabel}
            </Button>
          </AiActions>
        </AiCardBase>
      );
    };

    if (!top) return null;

    return (
      <AiStackWrap>
        {third ? <Card card={third} offset={12} scale={0.96} rotate={-1} /> : null}
        {second ? <Card card={second} offset={6} scale={0.98} rotate={1} /> : null}
        <Card card={top} offset={0} scale={1} rotate={0} interactive />
      </AiStackWrap>
    );
  };

  const onDropOn = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const fromIndex = layout.findIndex((w) => w.id === dragId);
    const toIndex = layout.findIndex((w) => w.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;
    const next = [...layout];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setLayout(next);
    setDragId(null);
  };

  return (
    <Grid>
      {layout.map((w) => {
        const def = defs.get(w.type);
        const span = spanFor(w.size);
        return (
          <WidgetContainerWeb
            key={w.id}
            title={def?.title ?? w.type}
            category={def?.category ?? "work"}
            description={def?.description}
            span={span}
            isDragSource={dragId === w.id}
            onDelete={() => removeWidget(w.id)}
            onMove={() => {
              // Highlights the card; user can drag it to reorder.
              setDragId(w.id);
            }}
            draggableProps={{
              draggable: mode !== "delete",
              onDragStart: () => setDragId(w.id),
              onDragEnd: () => setDragId(null),
              onDragOver: (e) => e.preventDefault(),
              onDrop: () => onDropOn(w.id),
            }}
          >
            {renderWidget(w.type)}
          </WidgetContainerWeb>
        );
      })}
    </Grid>
  );
}
