import React, { useEffect, useMemo, useRef } from "react";
import { Modal, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { widgetCatalog } from "./widgetTypes";
import type { WidgetLayoutItem } from "./widgetTypes";
import { WidgetContainerNative } from "./WidgetContainer.native";
import { Button, Muted, TopStack } from "@ui/native";

import { IncomeExpenseWidget } from "./widgets/IncomeExpenseWidget";
import { TaxCountdownWidget } from "./widgets/TaxCountdownWidget";
import { ClientsAtRiskWidget } from "./widgets/ClientsAtRiskWidget";
import { ActiveProjectsWidget } from "./widgets/ActiveProjectsWidget";
import { MileageWidget } from "./widgets/MileageWidget";
import { CashFlowWidget } from "./widgets/CashFlowWidget";
import { AISuggestionsWidget } from "./widgets/AISuggestionsWidget";
import { BadgesWidget } from "./widgets/BadgesWidget";

const SwipeDelete = styled(Pressable)`
  width: 96px;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.danger};
`;

const SwipeDeleteText = styled.Text`
  color: #fff;
`;

const RingWrap = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const RingTrack = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-color: ${({ theme }) => theme.colors.border};
`;

const HalfClip = styled.View<{ $side: "left" | "right"; $size: number }>`
  position: absolute;
  top: 0;
  ${({ $side, $size }) => ($side === "left" ? `left: 0;` : `right: 0;`)}
  width: ${({ $size }) => $size / 2}px;
  height: ${({ $size }) => $size}px;
  overflow: hidden;
`;

const HalfCircle = styled.View`
  position: absolute;
  top: 0;
`;

const RingCenter = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
`;

const RingValueText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 28px;
`;

const RingSubText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
`;

const MeterTrack = styled.View`
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const MeterFill = styled.View`
  height: 100%;
  border-radius: 999px;
`;

const StrongText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const StatWrap = styled.View`
  flex-direction: column;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StatCard = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const StatTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  text-align: center;
`;

const StatBody = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StatPillWrap = styled.View`
  flex-grow: 1;
  flex-basis: 0px;
  min-width: 0px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
`;

const StatPillLabel = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
`;

const StatPillValue = styled.Text<{ $tone?: "neutral" | "success" | "danger" }>`
  font-weight: 700;
  color: ${({ theme, $tone }) =>
    $tone === "success" ? theme.colors.success : $tone === "danger" ? theme.colors.danger : theme.colors.text};
  text-align: center;
`;

const StatPillHint = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
`;

const TopChevronButton = styled.Pressable`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

const TopChevronText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
`;

const InlineRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ToneTag = styled.Text<{ $tone: "danger" | "warning" | "success" }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  background: ${({ theme, $tone }) =>
    $tone === "danger" ? theme.colors.danger : $tone === "warning" ? theme.colors.warning : theme.colors.success};
`;

const BadgePillWrap = styled.View`
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.border};
`;

const BadgePillText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
`;

const WaterfallWrap = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const WaterfallBars = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: stretch;
`;

const WaterfallSlot = styled.View`
  flex: 1;
  min-width: 0;
`;

const WaterfallChart = styled.View`
  position: relative;
  height: 84px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const WaterfallBaseline = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const WaterfallBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const WaterfallLabel = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
`;

const CashFlowWrap = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  height: 96px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  overflow: hidden;
`;

const CashFlowOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const CashFlowBand = styled.View`
  position: absolute;
  bottom: 0;
`;

const CashFlowDot = styled.View`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 999px;
`;

const CashFlowSeg = styled.View`
  position: absolute;
  height: 2px;
  border-radius: 999px;
`;

const KanbanRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const KanbanCol = styled.View`
  flex: 1;
  min-width: 0;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const KanbanHeader = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  font-weight: 600;
`;

const KanbanCard = styled.View`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const KanbanCardTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 600;
`;

const KanbanCardMeta = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
`;

const AiStackWrap = styled.View`
  position: relative;
  height: 150px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const AiCardBase = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const AiTag = styled.Text<{ $bg: string }>`
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  background: ${({ $bg }) => $bg};
`;

const AiTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const AiDetail = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const AiActions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

function ProgressRingNative({
  progress,
  color,
  size = 84,
  stroke = 8,
  children,
}: {
  progress: number;
  color: string;
  size?: number;
  stroke?: number;
  children: React.ReactNode;
}) {
  const p = Math.max(0, Math.min(1, progress));
  const rightDeg = p <= 0.5 ? p * 360 : 180;
  const leftDeg = p <= 0.5 ? 0 : (p - 0.5) * 360;

  const radius = size / 2;
  const centerInset = stroke + 4;
  const centerSize = size - centerInset * 2;

  return (
    <RingWrap style={{ width: size, height: size, borderRadius: radius }}>
      <RingTrack style={{ borderWidth: stroke, borderRadius: radius }} />

      <HalfClip $side="right" $size={size}>
        <HalfCircle
          style={{
            left: -radius,
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: stroke,
            borderColor: color,
            transform: [{ rotate: `${rightDeg}deg` }],
          }}
        />
      </HalfClip>

      {p > 0.5 ? (
        <HalfClip $side="left" $size={size}>
          <HalfCircle
            style={{
              left: 0,
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: stroke,
              borderColor: color,
              transform: [{ rotate: `${leftDeg}deg` }],
            }}
          />
        </HalfClip>
      ) : null}

      <RingCenter
        style={{
          width: centerSize,
          height: centerSize,
          borderRadius: centerSize / 2,
        }}
      >
        {children}
      </RingCenter>
    </RingWrap>
  );
}

export function WidgetGridNative({
  mode = "default",
}: {
  mode?: "default" | "move" | "delete";
}) {
  const layout = useDashboardStore((s) => s.preset.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const removeWidget = useDashboardStore((s) => s.removeWidget);

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
  }) => (
    <ProgressRingNative
      progress={progress}
      color={tone === "danger" ? theme.colors.danger : tone === "warning" ? theme.colors.warning : theme.colors.success}
    >
      {children}
    </ProgressRingNative>
  );

  const BadgesRing = ({ progress, children }: { progress: number; children: React.ReactNode }) => (
    <ProgressRingNative progress={progress} color={theme.colors.category.insights}>
      {children}
    </ProgressRingNative>
  );

  const Row = ({ children }: { children: React.ReactNode }) => <InlineRow>{children}</InlineRow>;
  const Tag = ({ tone, children }: { tone: "danger" | "warning" | "success"; children: React.ReactNode }) => (
    <ToneTag $tone={tone}>{children}</ToneTag>
  );

  const Tap = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <Pressable onPress={onPress}>{children}</Pressable>
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
  }) => (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <TopStack
          title={title ?? "Details"}
          left={
            <TopChevronButton onPress={onClose} hitSlop={12}>
              <TopChevronText>‹</TopChevronText>
            </TopChevronButton>
          }
        />
        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

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

  const Meter = ({ progress, tone }: { progress: number; tone?: "success" | "warning" | "danger" }) => {
    const p = Math.max(0, Math.min(1, progress));
    const color =
      tone === "danger" ? theme.colors.danger : tone === "warning" ? theme.colors.warning : theme.colors.success;
    return (
      <MeterTrack style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.xs }}>
        <MeterFill style={{ width: `${Math.round(p * 100)}%`, backgroundColor: color }} />
      </MeterTrack>
    );
  };

  const BadgeShelf = ({ children }: { children: React.ReactNode }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
      {children}
    </ScrollView>
  );
  const BadgePill = ({ label }: { label: string }) => (
    <BadgePillWrap>
      <BadgePillText>{label}</BadgePillText>
    </BadgePillWrap>
  );

  const Waterfall = ({
    items,
    compact,
    onSelectKey,
    selectedKey,
  }: {
    items: Array<{ key: string; label: string; from: number; to: number; tone: "income" | "expense" | "net" }>;
    compact?: boolean;
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
      <WaterfallWrap>
        <WaterfallBars>
          {items.map((it) => {
            const top = Math.min(yFor(it.from), yFor(it.to));
            const height = Math.max(2, Math.abs(yFor(it.from) - yFor(it.to)));
            const isSel = selectedKey === it.key;
            return (
              <WaterfallSlot key={it.key}>
                <Pressable disabled={!interactive} onPress={() => onSelectKey?.(it.key)}>
                  <WaterfallChart
                    style={{
                      height: H,
                      borderWidth: isSel ? 2 : 0,
                      borderColor: theme.colors.primary,
                    }}
                  >
                    <WaterfallBaseline style={{ top: y0 }} />
                    <WaterfallBar
                      style={{
                        top,
                        height,
                        backgroundColor: colorFor(it.tone, it.to),
                      }}
                    />
                  </WaterfallChart>
                </Pressable>
                <WaterfallLabel numberOfLines={1}>{it.label}</WaterfallLabel>
              </WaterfallSlot>
            );
          })}
        </WaterfallBars>
      </WaterfallWrap>
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
              <KanbanCardTitle>{card.title}</KanbanCardTitle>
              {card.meta ? <KanbanCardMeta>{card.meta}</KanbanCardMeta> : null}
            </KanbanCard>
          ))}
          {col.count > 3 ? <KanbanCardMeta>+{col.count - 3} more</KanbanCardMeta> : null}
        </KanbanCol>
      ))}
    </KanbanRow>
  );

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
    }) => (
      <AiCardBase
        style={{
          top: offset,
          transform: [{ scale }, { rotate: `${rotate}deg` }],
          opacity: interactive ? 1 : 0.92,
        }}
      >
        <AiTag $bg={colorForCategory(card.category)}>{card.category}</AiTag>
        <AiTitle>{card.title}</AiTitle>
        <AiDetail>{card.detail}</AiDetail>
        <AiActions>
          <Button title="Later" variant="ghost" onPress={() => onDismiss(card.id)} />
          <Button title={card.actionLabel} variant="primary" onPress={() => onDo(card.id)} />
        </AiActions>
      </AiCardBase>
    );

    if (!top) return null;

    return (
      <AiStackWrap>
        {third ? <Card card={third} offset={12} scale={0.96} rotate={-1} /> : null}
        {second ? <Card card={second} offset={6} scale={0.98} rotate={1} /> : null}
        <Swipeable
          renderLeftActions={() => null}
          renderRightActions={() => null}
          onSwipeableOpen={(direction) => {
            if (direction === "right") onDo(top.id);
            else onDismiss(top.id);
          }}
        >
          <Card card={top} offset={0} scale={1} rotate={0} interactive />
        </Swipeable>
      </AiStackWrap>
    );
  };

  const CashFlowChart = ({
    points,
  }: {
    points: Array<{ label: string; inflow: number; outflow: number }>;
  }) => {
    const [w, setW] = React.useState(0);
    const H = 96;
    const P = 8;

    const maxV = Math.max(1, ...points.flatMap((p) => [p.inflow, p.outflow]));

    const xFor = (i: number) => {
      if (points.length <= 1) return P;
      const t = i / (points.length - 1);
      return P + t * Math.max(0, w - P * 2);
    };
    const yFor = (v: number) => P + (1 - v / maxV) * (H - P * 2);

    const segs = (key: "inflow" | "outflow") => {
      const color = key === "inflow" ? theme.colors.success : theme.colors.danger;
      const result: React.ReactNode[] = [];

      for (let i = 0; i < points.length - 1; i++) {
        const x1 = xFor(i);
        const x2 = xFor(i + 1);
        const y1 = yFor(points[i][key]);
        const y2 = yFor(points[i + 1][key]);

        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        result.push(
          <CashFlowSeg
            key={`${key}_seg_${i}`}
            style={{
              left: x1,
              top: y1,
              width: len,
              backgroundColor: color,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: "0px 0px" as any,
            }}
          />
        );
      }

      for (let i = 0; i < points.length; i++) {
        const x = xFor(i) - 3;
        const y = yFor(points[i][key]) - 3;
        result.push(
          <CashFlowDot
            key={`${key}_dot_${i}`}
            style={{ left: x, top: y, backgroundColor: color }}
          />
        );
      }

      return result;
    };

    return (
      <CashFlowWrap onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {w > 0 ? (
          <>
            {/* Bands: filled to baseline (overlapping) */}
            {points.map((p, i) => {
              const sliceW = points.length > 1 ? Math.max(2, (w - P * 2) / (points.length - 1)) : Math.max(2, w - P * 2);
              const x = xFor(i) - sliceW / 2;
              const inflowH = Math.max(0, H - P - yFor(p.inflow));
              const outflowH = Math.max(0, H - P - yFor(p.outflow));
              return (
                <React.Fragment key={`band_${i}`}> 
                  <CashFlowBand
                    style={{
                      left: x,
                      width: sliceW,
                      height: inflowH,
                      backgroundColor: theme.colors.success,
                      opacity: 0.14,
                    }}
                  />
                  <CashFlowBand
                    style={{
                      left: x,
                      width: sliceW,
                      height: outflowH,
                      backgroundColor: theme.colors.danger,
                      opacity: 0.12,
                    }}
                  />
                </React.Fragment>
              );
            })}

            {/* Lines on top */}
            <CashFlowOverlay>{segs("inflow")}</CashFlowOverlay>
            <CashFlowOverlay>{segs("outflow")}</CashFlowOverlay>
          </>
        ) : null}
      </CashFlowWrap>
    );
  };

  const renderWidget = (type: WidgetLayoutItem["type"]) => {
    switch (type) {
      case "IncomeExpense":
        return (
          <IncomeExpenseWidget
            Text={Text}
            StrongText={StrongText}
            Row={Row}
            Button={Button}
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
            BadgeShelf={BadgeShelf}
            BadgePill={BadgePill}
          />
        );
    }
  };

  const demoRef = useRef<Swipeable | null>(null);
  const demoTimers = useRef<number[]>([]);

  useEffect(() => {
    demoTimers.current.forEach((t) => clearTimeout(t));
    demoTimers.current = [];

    if (mode !== "delete") {
      demoRef.current?.close?.();
      return;
    }

    if (!layout.length) return;

    // Demo: open + close twice within ~1s.
    const t1 = setTimeout(() => demoRef.current?.openRight?.(), 50);
    const t2 = setTimeout(() => demoRef.current?.close?.(), 300);
    const t3 = setTimeout(() => demoRef.current?.openRight?.(), 550);
    const t4 = setTimeout(() => demoRef.current?.close?.(), 800);
    demoTimers.current = [t1, t2, t3, t4] as unknown as number[];

    return () => {
      demoTimers.current.forEach((t) => clearTimeout(t));
      demoTimers.current = [];
    };
  }, [mode, layout.length]);

  const move = (id: string, dir: -1 | 1) => {
    const idx = layout.findIndex((w) => w.id === id);
    const nextIdx = idx + dir;
    if (idx < 0 || nextIdx < 0 || nextIdx >= layout.length) return;
    const next = [...layout];
    const [moved] = next.splice(idx, 1);
    next.splice(nextIdx, 0, moved);
    setLayout(next);
  };

  return (
    <>
      {layout.map((w) => {
        const def = defs.get(w.type);
        const content = (
          <WidgetContainerNative
            key={w.id}
            title={def?.title ?? w.type}
            category={def?.category ?? "work"}
            description={def?.description}
          >
            {renderWidget(w.type)}
            {mode === "move" ? (
              <>
                <Muted onPress={() => move(w.id, -1)}>↑ Move up</Muted>
                <Muted onPress={() => move(w.id, 1)}>↓ Move down</Muted>
              </>
            ) : null}
          </WidgetContainerNative>
        );

        if (mode !== "delete") {
          return content;
        }

        return (
          <Swipeable
            key={w.id}
            ref={w.id === layout[0]?.id ? demoRef : undefined}
            rightThreshold={72}
            renderRightActions={() => (
              <SwipeDelete onPress={() => removeWidget(w.id)}>
                <SwipeDeleteText>Delete</SwipeDeleteText>
              </SwipeDelete>
            )}
            onSwipeableOpen={() => removeWidget(w.id)}
          >
            {content}
          </Swipeable>
        );
      })}
    </>
  );
}
