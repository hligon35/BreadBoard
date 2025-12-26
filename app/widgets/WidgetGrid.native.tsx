import React, { useEffect, useMemo, useRef } from "react";
import { Modal, PanResponder, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useWorkStore } from "@app/context/stores/useWorkStore";
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
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  position: relative;
`;

const StatPillHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
  overflow: hidden;
`;

const StatPillCornerBadge = styled.View`
  position: absolute;
  top: -10px;
  right: -4px;
  padding: 1px 1px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const StatPillCornerBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  font-weight: 700;
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

const CashFlowForecastSeg = styled.View`
  position: absolute;
  height: 2px;
  border-radius: 999px;
  opacity: 0.7;
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

const KanbanProgressTrack = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const KanbanProgressFill = styled.View`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const KanbanTileTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const KanbanTileMetaRow = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const KanbanAvatar = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const KanbanAvatarText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 10px;
  font-weight: 700;
`;

const BoardWrap = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
`;

const BoardStack = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BoardColBase = styled.View<{ $active?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.bg)};
  border-width: 1px;
  border-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const BoardColWithRef: any = BoardColBase;

const BoardCol = React.forwardRef<View, React.ComponentProps<typeof BoardColBase>>(
  ({ children, ...rest }, ref) => (
    <BoardColWithRef ref={ref} {...rest}>
      {children}
    </BoardColWithRef>
  )
);
BoardCol.displayName = "BoardCol";

const BoardTile = styled.View<{ $dragging?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs}px;
  opacity: ${({ $dragging }) => ($dragging ? 0.55 : 1)};
`;

const GanttWrap = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
`;

const GanttRow = styled.View`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const GanttBarTrack = styled.View`
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const GanttBarWindow = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bg};
`;

const GanttBarFill = styled.View`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const AiStackWrap = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
`;

const AiCardBase = styled.View`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0px;
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

  const clients = useClientsStore((s) => s.clients);
  const workSummary = useWorkStore((s) => s.summary);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);
  const theme = useTheme();

  const clientsAtRiskCount = useMemo(() => {
    const riskFor = (status: string, riskLevel?: string) => {
      if (riskLevel) return riskLevel;
      if (status === "at_risk") return "high";
      if (status === "inactive") return "medium";
      return "low";
    };
    return clients.filter((c) => riskFor(c.status, (c as any).riskLevel) === "high").length;
  }, [clients]);

  const clientsAtRiskMeter = "🟥 🟨 🟩";

  const activeProjectsCount = workSummary?.activeProjects ?? 0;

  const HeaderBadge = styled.Text<{ $tone: "danger" | "neutral" }>`
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
    overflow: hidden;
    color: ${({ theme, $tone }) => ($tone === "danger" ? "#fff" : theme.colors.text)};
    background: ${({ theme, $tone }) => ($tone === "danger" ? theme.colors.danger : theme.colors.border)};
    font-size: 12px;
    font-weight: 700;
  `;

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

  const Row = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <InlineRow style={style}>{children}</InlineRow>
  );

  const Col = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <View style={[{ flexDirection: "column", alignItems: "flex-start" }, style]}>{children}</View>
  );
  const Tag = ({ tone, children }: { tone: "danger" | "warning" | "success"; children: React.ReactNode }) => (
    <ToneTag $tone={tone}>{children}</ToneTag>
  );

  const Tap = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
    <Pressable onPress={onPress} style={{ width: "100%", alignSelf: "stretch" }}>
      {children}
    </Pressable>
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
    inline,
    badge,
  }: {
    label: string;
    value: string;
    tone?: "neutral" | "success" | "danger";
    hint?: string;
    inline?: boolean;
    badge?: string;
  }) => (
    <StatPillWrap>
      {badge ? (
        <StatPillCornerBadge>
          <StatPillCornerBadgeText>{badge}</StatPillCornerBadgeText>
        </StatPillCornerBadge>
      ) : null}
      {inline ? (
        <StatPillHeaderRow>
          <StatPillLabel>{label}</StatPillLabel>
          <StatPillValue $tone={tone}>{value}</StatPillValue>
        </StatPillHeaderRow>
      ) : (
        <>
          <StatPillLabel>{label}</StatPillLabel>
          <StatPillValue $tone={tone}>{value}</StatPillValue>
        </>
      )}
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
      cards: Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>;
    }>;
  }) => (
    <KanbanRow>
      {columns.map((col) => (
        <KanbanCol key={col.key}>
          <KanbanHeader>
            {col.title} • {col.count}
          </KanbanHeader>
          {col.cards.slice(0, 2).map((card) => (
            <KanbanCard key={card.id}>
              <KanbanCardTitle numberOfLines={1}>{card.title}</KanbanCardTitle>
              {card.meta ? <KanbanCardMeta numberOfLines={1}>{card.meta}</KanbanCardMeta> : null}
              <KanbanProgressTrack>
                <KanbanProgressFill
                  style={{
                    width: `${Math.round(
                      100 *
                        (typeof card.progress === "number"
                          ? Math.max(0, Math.min(1, card.progress))
                          : col.key === "done"
                            ? 1
                            : col.key === "doing"
                              ? 0.55
                              : 0.25)
                    )}%`,
                  }}
                />
              </KanbanProgressTrack>
            </KanbanCard>
          ))}
          {col.count > 2 ? <KanbanCardMeta numberOfLines={1}>+{col.count - 2} more</KanbanCardMeta> : null}
        </KanbanCol>
      ))}
    </KanbanRow>
  );

  const KanbanBoard = ({
    columns,
    onMoveCard,
  }: {
    columns: Array<{
      key: "todo" | "doing" | "done";
      title: string;
      cards: Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>;
    }>;
    onMoveCard?: (cardId: string, toColumnKey: "todo" | "doing" | "done") => void;
  }) => {
    const layouts = useRef<Record<string, { y: number; h: number }>>({});
    const colRefs = useRef<Record<string, any>>({});
    const [hover, setHover] = React.useState<"todo" | "doing" | "done" | null>(null);
    const [dragging, setDragging] = React.useState<string | null>(null);

    const measure = (key: "todo" | "doing" | "done") => {
      const ref = colRefs.current[key];
      if (!ref?.measureInWindow) return;
      ref.measureInWindow((_x: number, y: number, _w: number, h: number) => {
        layouts.current[key] = { y, h };
      });
    };

    const keyForPageY = (pageY: number) => {
      const keys: Array<"todo" | "doing" | "done"> = ["todo", "doing", "done"];
      for (const k of keys) {
        const box = layouts.current[k];
        if (!box) continue;
        if (pageY >= box.y && pageY <= box.y + box.h) return k;
      }
      return null;
    };

    const Tile = ({
      card,
      from,
    }: {
      card: { id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string };
      from: "todo" | "doing" | "done";
    }) => {
      const responder = useMemo(
        () =>
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              setDragging(card.id);
              setHover(from);
            },
            onPanResponderMove: (evt) => {
              const pageY = (evt.nativeEvent as any).pageY as number | undefined;
              if (typeof pageY !== "number") return;
              const k = keyForPageY(pageY);
              if (k && k !== hover) setHover(k);
            },
            onPanResponderRelease: () => {
              const to = hover ?? from;
              setDragging(null);
              setHover(null);
              if (to !== from) onMoveCard?.(card.id, to);
            },
            onPanResponderTerminate: () => {
              setDragging(null);
              setHover(null);
            },
          }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [card.id, from, hover, onMoveCard]
      );

      const p = typeof card.progress === "number" ? Math.max(0, Math.min(1, card.progress)) : from === "done" ? 1 : from === "doing" ? 0.55 : 0.25;

      return (
        <BoardTile
          {...responder.panHandlers}
          $dragging={dragging === card.id}
        >
          <KanbanTileTop>
            <KanbanCardTitle>{card.title}</KanbanCardTitle>
            {card.avatar ? (
              <KanbanAvatar>
                <KanbanAvatarText>{card.avatar}</KanbanAvatarText>
              </KanbanAvatar>
            ) : null}
          </KanbanTileTop>
          {card.meta ? <KanbanCardMeta>{card.meta}</KanbanCardMeta> : null}
          <KanbanTileMetaRow>
            <KanbanCardMeta>{from.toUpperCase()}</KanbanCardMeta>
            {card.deadline ? <KanbanCardMeta>{card.deadline}</KanbanCardMeta> : null}
          </KanbanTileMetaRow>
          <KanbanProgressTrack>
            <KanbanProgressFill style={{ width: `${Math.round(100 * p)}%` }} />
          </KanbanProgressTrack>
        </BoardTile>
      );
    };

    return (
      <BoardWrap>
        <BoardStack>
          {columns.map((col) => (
            <BoardCol
              key={col.key}
              $active={hover === col.key}
              ref={(r: any) => {
                colRefs.current[col.key] = r;
              }}
              onLayout={() => measure(col.key)}
            >
              <KanbanHeader>
                {col.title} • {col.cards.length}
              </KanbanHeader>
              {col.cards.map((card) => (
                <Tile key={card.id} card={card} from={col.key} />
              ))}
            </BoardCol>
          ))}
        </BoardStack>
      </BoardWrap>
    );
  };

  const Gantt = ({
    items,
  }: {
    items: Array<{
      id: string;
      title: string;
      meta?: string;
      status: "todo" | "doing" | "done";
      deadline?: string;
      progress?: number;
      avatar?: string;
    }>;
  }) => {
    const dayMs = 24 * 60 * 60 * 1000;
    const parsed = items.map((it) => {
      const d = it.deadline ? new Date(it.deadline) : new Date(Date.now() + 7 * dayMs);
      const start = new Date(d.getTime() - 14 * dayMs);
      const p = typeof it.progress === "number" ? Math.max(0, Math.min(1, it.progress)) : it.status === "done" ? 1 : it.status === "doing" ? 0.55 : 0.25;
      return { ...it, start, end: d, p };
    });

    const minStart = Math.min(...parsed.map((p) => p.start.getTime()));
    const maxEnd = Math.max(...parsed.map((p) => p.end.getTime()));
    const range = Math.max(dayMs, maxEnd - minStart);

    return (
      <GanttWrap>
        {parsed.map((it) => {
          const left = (it.start.getTime() - minStart) / range;
          const width = (it.end.getTime() - it.start.getTime()) / range;

          return (
            <GanttRow key={it.id}>
              <KanbanTileTop>
                <KanbanCardTitle>{it.title}</KanbanCardTitle>
                {it.avatar ? (
                  <KanbanAvatar>
                    <KanbanAvatarText>{it.avatar}</KanbanAvatarText>
                  </KanbanAvatar>
                ) : null}
              </KanbanTileTop>
              <KanbanTileMetaRow>
                <KanbanCardMeta>{it.status.toUpperCase()}</KanbanCardMeta>
                {it.deadline ? <KanbanCardMeta>{it.deadline}</KanbanCardMeta> : null}
              </KanbanTileMetaRow>
              {it.meta ? <KanbanCardMeta>{it.meta}</KanbanCardMeta> : null}
              <GanttBarTrack>
                <GanttBarWindow style={{ left: `${Math.round(left * 100)}%`, width: `${Math.max(2, Math.round(width * 100))}%` }}>
                  <GanttBarFill style={{ width: `${Math.round(it.p * 100)}%` }} />
                </GanttBarWindow>
              </GanttBarTrack>
            </GanttRow>
          );
        })}
      </GanttWrap>
    );
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
    const { width: windowWidth } = useWindowDimensions();
    const top = cards[0];
    const second = cards[1];
    const third = cards[2];

    const colorForCategory = (cat: "Finance" | "Clients" | "Workflow") => {
      if (cat === "Finance") return theme.colors.category.money;
      if (cat === "Clients") return theme.colors.category.clients;
      return theme.colors.category.work;
    };

    const iconForCategory = (cat: "Finance" | "Clients" | "Workflow") => {
      if (cat === "Finance") return "💰";
      if (cat === "Clients") return "👥";
      return "🛠️";
    };

    const cardW = Math.max(
      160,
      Math.floor((windowWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2)
    );

    const Card = ({ card }: { card: typeof top }) => (
      <Pressable
        onPress={() => onDo(card.id)}
        style={{ width: cardW }}
      >
        <AiCardBase>
          <AiTag $bg={colorForCategory(card.category)}>
            {iconForCategory(card.category)} {card.category}
          </AiTag>
          <AiTitle numberOfLines={1}>{card.title}</AiTitle>
          <AiDetail numberOfLines={2}>{card.detail}</AiDetail>
        </AiCardBase>
      </Pressable>
    );

    if (!top) return null;

    const visible = [top, second, third].filter(Boolean) as Array<typeof top>;

    return (
      <AiStackWrap>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            gap: theme.spacing.sm,
          }}
        >
          {visible.map((c) => (
            <Card key={c.id} card={c} />
          ))}
        </ScrollView>
      </AiStackWrap>
    );
  };

  const CashFlowChart = ({
    points,
    compact,
    showZones,
    forecastNet,
  }: {
    points: Array<{ label: string; inflow: number; outflow: number }>;
    compact?: boolean;
    showZones?: boolean;
    forecastNet?: Array<{ label: string; value: number }>;
  }) => {
    const [w, setW] = React.useState(0);
    const H = compact ? 64 : 140;
    const P = 8;

    const maxV = Math.max(1, ...points.flatMap((p) => [p.inflow, p.outflow]));

    const forecastCount = forecastNet?.length ?? 0;
    const reserve = forecastCount ? Math.min(48, Math.max(0, (w - P * 2) * 0.25)) : 0;
    const plotW = Math.max(0, (w - P * 2) - reserve);

    const xFor = (i: number) => {
      if (points.length <= 1) return P;
      const t = i / (points.length - 1);
      return P + t * plotW;
    };
    const yFor = (v: number) => P + (1 - v / maxV) * (H - P * 2);

    const netMax = Math.max(1, ...points.map((p) => Math.abs(p.inflow - p.outflow)));
    const yForNet = (v: number) => P + (1 - (v + netMax) / (netMax * 2)) * (H - P * 2);

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

    const forecastSegs = () => {
      if (!forecastNet?.length || !reserve) return null;

      const net = points.map((p) => p.inflow - p.outflow);
      const lastIndex = points.length - 1;
      const lastX = xFor(lastIndex);
      const lastY = yForNet(net[lastIndex]);

      const stepX = reserve / forecastNet.length;
      const color = theme.colors.mutedText;
      const nodes: React.ReactNode[] = [];

      let prevX = lastX;
      let prevY = lastY;
      for (let j = 0; j < forecastNet.length; j++) {
        const nextX = lastX + stepX * (j + 1);
        const nextY = yForNet(forecastNet[j].value);

        const dx = nextX - prevX;
        const dy = nextY - prevY;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        const dash = 10;
        const gap = 6;
        const step = dash + gap;
        const count = Math.max(1, Math.floor(len / step));

        for (let d = 0; d < count; d++) {
          const left = prevX + (dx / len) * (d * step);
          const top = prevY + (dy / len) * (d * step);
          nodes.push(
            <CashFlowForecastSeg
              key={`forecast_${j}_${d}`}
              style={{
                left,
                top,
                width: Math.min(dash, len - d * step),
                backgroundColor: color,
                transform: [{ rotate: `${angle}deg` }],
                transformOrigin: "0px 0px" as any,
              }}
            />
          );
        }

        prevX = nextX;
        prevY = nextY;
      }

      return <CashFlowOverlay>{nodes}</CashFlowOverlay>;
    };

    return (
      <CashFlowWrap style={{ height: H }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {w > 0 ? (
          <>
            {/* Zones (net positive/negative) */}
            {showZones
              ? points.map((p, i) => {
                  const sliceW =
                    points.length > 1 ? Math.max(2, plotW / (points.length - 1)) : Math.max(2, plotW);
                  const x = xFor(i) - sliceW / 2;
                  const isPos = p.inflow - p.outflow >= 0;
                  return (
                    <CashFlowBand
                      key={`zone_${i}`}
                      style={{
                        left: x,
                        width: sliceW,
                        height: H,
                        backgroundColor: isPos ? theme.colors.success : theme.colors.danger,
                        opacity: 0.06,
                      }}
                    />
                  );
                })
              : null}

            {/* Bands: filled to baseline (overlapping) */}
            {points.map((p, i) => {
              const sliceW = points.length > 1 ? Math.max(2, plotW / (points.length - 1)) : Math.max(2, plotW);
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
            {forecastSegs()}
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
        return <TaxCountdownWidget Text={RingSub} ValueText={RingValue} ProgressRing={TaxRing} Meter={Meter} Row={Row} Col={Col} />;
      case "ClientsAtRisk":
        return (
          <ClientsAtRiskWidget
            Text={Text}
            StrongText={StrongText}
            Row={Row}
            Tag={Tag}
            Button={Button}
            Tap={Tap}
            FullScreen={FullScreen}
            Wrap={Wrap}
            Section={Section}
            StatPill={StatPill}
          />
        );
      case "ActiveProjects":
        return (
          <ActiveProjectsWidget
            Text={Text}
            StrongText={StrongText}
            Kanban={Kanban}
            KanbanBoard={KanbanBoard}
            Gantt={Gantt}
            Row={Row}
            Button={Button}
            Tap={Tap}
            FullScreen={FullScreen}
          />
        );
      case "Mileage":
        return <MileageWidget Text={Text} />;
      case "CashFlow":
        return (
          <CashFlowWidget
            Text={Text}
            StrongText={StrongText}
            Chart={CashFlowChart}
            Button={Button}
            Row={Row}
            Tap={Tap}
            FullScreen={FullScreen}
            StatPill={StatPill}
          />
        );
      case "AISuggestions":
        return (
          <AISuggestionsWidget
            Text={Text}
            StrongText={StrongText}
            CardStack={AiCardStack}
            Row={Row}
            Button={({ title, onPress, variant }) => <Button title={title} onPress={onPress} variant={variant} />}
            Tap={Tap}
            FullScreen={FullScreen}
            Wrap={Wrap}
            Section={Section}
          />
        );
      case "Badges":
        return (
          <BadgesWidget
            Text={Text}
            StrongText={StrongText}
            ProgressRing={BadgesRing}
            BadgeShelf={BadgeShelf}
            BadgePill={BadgePill}
            Row={Row}
            Button={({ title, onPress, variant }) => <Button title={title} onPress={onPress} variant={variant} />}
            Tap={Tap}
            FullScreen={FullScreen}
            Wrap={Wrap}
            Section={Section}
            Meter={Meter}
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
        const isClientsAtRisk = w.type === "ClientsAtRisk";
        const isActiveProjects = w.type === "ActiveProjects";
        const content = (
          <WidgetContainerNative
            key={w.id}
            title={def?.title ?? w.type}
            category={def?.category ?? "work"}
            description={def?.description}
            titleAfter={
              isClientsAtRisk ? (
                <HeaderBadge $tone={clientsAtRiskCount ? "danger" : "neutral"}>{clientsAtRiskCount}</HeaderBadge>
              ) : isActiveProjects ? (
                <HeaderBadge $tone={activeProjectsCount ? "neutral" : "neutral"}>{activeProjectsCount}</HeaderBadge>
              ) : undefined
            }
            headerRight={isClientsAtRisk ? <Muted>{clientsAtRiskMeter}</Muted> : undefined}
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
