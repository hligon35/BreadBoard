import React, { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { Button, Muted, TopStack } from "@ui/web";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useWorkStore } from "@app/context/stores/useWorkStore";
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
  display: block;
  width: 100%;
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
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const StatPillHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const StatPillCornerBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -4px;
  padding: 1px 1px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  font-weight: 700;
`;

const StatPillLabel = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  flex: 0 0 auto;
`;

const StatPillValue = styled.div<{ $tone?: "neutral" | "success" | "danger" }>`
  font-weight: 800;
  color: ${({ theme, $tone }) =>
    $tone === "success" ? theme.colors.success : $tone === "danger" ? theme.colors.danger : theme.colors.text};
  text-align: center;
  white-space: nowrap;
  flex: 0 1 auto;
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

const InlineCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

const KanbanProgressTrack = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const KanbanProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const KanbanTileTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const KanbanTileMetaRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const KanbanAvatar = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex: 0 0 auto;
`;

const KanbanAvatarText = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
  font-size: 10px;
  font-weight: 700;
`;

const BoardWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
`;

const BoardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const BoardCol = styled.div<{ $active?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.bg)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  padding: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const BoardTilesWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const BoardTile = styled.div<{ $dragging?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xs}px;
  opacity: ${({ $dragging }) => ($dragging ? 0.55 : 1)};
  cursor: grab;
  user-select: none;
`;

const GanttWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
`;

const GanttRow = styled.div`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const GanttBarTrack = styled.div`
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  position: relative;
`;

const GanttBarWindow = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bg};
`;

const GanttBarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const AiStackWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow-x: auto;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => -theme.spacing.lg}px;
  margin-right: ${({ theme }) => -theme.spacing.lg}px;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme }) => theme.spacing.lg}px;
`;

const AiCardBase = styled.div`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm}px;
  user-select: none;
  touch-action: none;
  min-width: 0;
  flex: 0 0 calc((100% - ${({ theme }) => theme.spacing.sm}px) / 2);
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

  const clients = useClientsStore((s) => s.clients);
  const workSummary = useWorkStore((s) => s.summary);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const removeWidget = useDashboardStore((s) => s.removeWidget);

  const [dragId, setDragId] = useState<string | null>(null);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);
  const theme = useTheme();

  const clientsAtRiskCount = useMemo(() => {
    const riskFor = (status: string, riskLevel?: string) => {
      if (riskLevel) return riskLevel;
      if (status === "at_risk") return "high";
      if (status === "inactive") return "medium";
      return "low";
    };
    return clients.filter((c) => riskFor((c as any).status, (c as any).riskLevel) === "high").length;
  }, [clients]);

  const clientsAtRiskMeter = "🟥 🟨 🟩";

  const activeProjectsCount = workSummary?.activeProjects ?? 0;

  const HeaderBadge = styled.span<{ $tone: "danger" | "neutral" }>`
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
    font-size: 12px;
    font-weight: 800;
    color: ${({ theme, $tone }) => ($tone === "danger" ? "#fff" : theme.colors.text)};
    background: ${({ theme, $tone }) => ($tone === "danger" ? theme.colors.danger : theme.colors.border)};
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

  const Row = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <InlineRow style={style}>{children}</InlineRow>
  );

  const Col = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <InlineCol style={style}>{children}</InlineCol>
  );
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
      {badge ? <StatPillCornerBadge>{badge}</StatPillCornerBadge> : null}
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
    const W = 100;
    const H = compact ? 64 : 140;
    const P = 8;

    const maxV = Math.max(1, ...points.flatMap((p) => [p.inflow, p.outflow]));
    const forecastCount = forecastNet?.length ?? 0;
    const reserve = forecastCount ? Math.min(24, (W - P * 2) * 0.25) : 0;
    const plotW = (W - P * 2) - reserve;
    const xFor = (i: number) => {
      if (points.length <= 1) return P;
      const t = i / (points.length - 1);
      return P + t * plotW;
    };
    const yFor = (v: number) => P + (1 - v / maxV) * (H - P * 2);

    const net = points.map((p) => p.inflow - p.outflow);
    const netMax = Math.max(1, ...net.map((v) => Math.abs(v)));
    const yForNet = (v: number) => P + (1 - (v + netMax) / (netMax * 2)) * (H - P * 2);

    const lastIndex = Math.max(0, points.length - 1);
    const lastX = xFor(lastIndex);

    const pathFor = (key: "inflow" | "outflow") =>
      points
        .map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(2)},${yFor(p[key]).toFixed(2)}`)
        .join(" ");

    const areaFor = (key: "inflow" | "outflow") => {
      const top = points.map((p, i) => `${xFor(i).toFixed(2)},${yFor(p[key]).toFixed(2)}`).join(" L ");
      const bottomY = (H - P).toFixed(2);
      const rightX = xFor(Math.max(0, points.length - 1)).toFixed(2);
      return `M${P},${bottomY} L ${top} L ${rightX},${bottomY} Z`;
    };

    const forecastNetPath = () => {
      if (!forecastNet?.length || !reserve) return null;
      const stepX = reserve / forecastNet.length;
      const startY = yForNet(net[lastIndex]);
      const segs = forecastNet.map((f, j) => {
        const x = lastX + stepX * (j + 1);
        const y = yForNet(f.value);
        return `L${x.toFixed(2)},${y.toFixed(2)}`;
      });
      return `M${lastX.toFixed(2)},${startY.toFixed(2)} ${segs.join(" ")}`;
    };

    const inflow = theme.colors.success;
    const outflow = theme.colors.danger;

    return (
      <CashFlowWrap style={{ height: H }}>
        <CashFlowSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          {showZones
            ? points.map((p, i) => {
              const sliceW = points.length > 1 ? plotW / (points.length - 1) : plotW;
                const x = xFor(i) - sliceW / 2;
                const isPos = p.inflow - p.outflow >= 0;
                return (
                  <rect
                    key={`zone_${i}`}
                    x={x}
                    y={0}
                    width={sliceW}
                    height={H}
                    fill={isPos ? theme.colors.success : theme.colors.danger}
                    opacity={0.06}
                  />
                );
              })
            : null}
          <path d={areaFor("inflow")} fill={inflow} opacity={0.14} />
          <path d={areaFor("outflow")} fill={outflow} opacity={0.12} />
          <path d={pathFor("inflow")} stroke={inflow} strokeWidth={2} fill="none" />
          <path d={pathFor("outflow")} stroke={outflow} strokeWidth={2} fill="none" />
          {forecastNetPath() ? (
            <path
              d={forecastNetPath()!}
              stroke={theme.colors.mutedText}
              strokeWidth={2}
              fill="none"
              strokeDasharray="6 6"
              opacity={0.7}
            />
          ) : null}
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
              <KanbanCardTitle title={card.title}>{card.title}</KanbanCardTitle>
              {card.meta ? <KanbanCardMeta title={card.meta}>{card.meta}</KanbanCardMeta> : null}
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
          {col.count > 2 ? <KanbanCardMeta>+{col.count - 2} more</KanbanCardMeta> : null}
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
    const [hover, setHover] = useState<"todo" | "doing" | "done" | null>(null);
    const [dragging, setDragging] = useState<string | null>(null);

    return (
      <BoardWrap>
        <BoardRow>
          {columns.map((col) => (
            <BoardCol
              key={col.key}
              $active={hover === col.key}
              onDragOver={(e) => {
                e.preventDefault();
                if (hover !== col.key) setHover(col.key);
              }}
              onDragLeave={() => setHover(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setDragging(null);
                setHover(null);
                if (id) onMoveCard?.(id, col.key);
              }}
            >
              <KanbanHeader>
                {col.title} • {col.cards.length}
              </KanbanHeader>
              <BoardTilesWrap>
              {col.cards.map((card) => {
                const p =
                  typeof card.progress === "number"
                    ? Math.max(0, Math.min(1, card.progress))
                    : col.key === "done"
                      ? 1
                      : col.key === "doing"
                        ? 0.55
                        : 0.25;
                return (
                  <BoardTile
                    key={card.id}
                    draggable
                    $dragging={dragging === card.id}
                    onDragStart={(e) => {
                      setDragging(card.id);
                      e.dataTransfer.setData("text/plain", card.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setHover(null);
                    }}
                  >
                    <KanbanTileTop>
                      <KanbanCardTitle title={card.title}>{card.title}</KanbanCardTitle>
                      {card.avatar ? (
                        <KanbanAvatar>
                          <KanbanAvatarText>{card.avatar}</KanbanAvatarText>
                        </KanbanAvatar>
                      ) : null}
                    </KanbanTileTop>
                    {card.meta ? <KanbanCardMeta title={card.meta}>{card.meta}</KanbanCardMeta> : null}
                    <KanbanTileMetaRow>
                      <KanbanCardMeta>{col.key.toUpperCase()}</KanbanCardMeta>
                      {card.deadline ? <KanbanCardMeta>{card.deadline}</KanbanCardMeta> : null}
                    </KanbanTileMetaRow>
                    <KanbanProgressTrack>
                      <KanbanProgressFill style={{ width: `${Math.round(100 * p)}%` }} />
                    </KanbanProgressTrack>
                  </BoardTile>
                );
              })}
              </BoardTilesWrap>
            </BoardCol>
          ))}
        </BoardRow>
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
      const p =
        typeof it.progress === "number"
          ? Math.max(0, Math.min(1, it.progress))
          : it.status === "done"
            ? 1
            : it.status === "doing"
              ? 0.55
              : 0.25;
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
                <KanbanCardTitle title={it.title}>{it.title}</KanbanCardTitle>
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
              {it.meta ? <KanbanCardMeta title={it.meta}>{it.meta}</KanbanCardMeta> : null}
              <GanttBarTrack>
                <GanttBarWindow
                  style={{
                    left: `${Math.round(left * 100)}%`,
                    width: `${Math.max(2, Math.round(width * 100))}%`,
                  }}
                >
                  <GanttBarFill style={{ width: `${Math.round(it.p * 100)}%` }} />
                </GanttBarWindow>
              </GanttBarTrack>
            </GanttRow>
          );
        })}
      </GanttWrap>
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
        return <TaxCountdownWidget Text={RingSub} ValueText={RingValue} ProgressRing={TaxRing} Meter={Meter} Row={Row} Col={Col} />;
      case "ClientsAtRisk":
        return (
          <ClientsAtRiskWidget
            Text={Text}
            StrongText={StrongText}
            Row={Row}
            Tag={Tag}
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
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
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
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
            Row={Row}
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
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
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
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
            BadgeShelf={Shelf}
            BadgePill={Pill}
            Row={Row}
            Button={({ title, onPress, variant }) => (
              <Button variant={variant} onClick={onPress}>
                {title}
              </Button>
            )}
            Tap={Tap}
            FullScreen={FullScreen}
            Wrap={Wrap}
            Section={Section}
            Meter={Meter}
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

    const iconForCategory = (cat: "Finance" | "Clients" | "Workflow") => {
      if (cat === "Finance") return "💰";
      if (cat === "Clients") return "👥";
      return "🛠️";
    };

    const Card = ({
      card,
      interactive,
    }: {
      card: typeof top;
      interactive?: boolean;
    }) => {
      return (
        <AiCardBase
          style={{ cursor: interactive ? "pointer" : "default" }}
          onClick={() => {
            if (!interactive) return;
            if (card?.id) onDo(card.id);
          }}
        >
          <AiTag $bg={colorForCategory(card.category)}>
            {iconForCategory(card.category)} {card.category}
          </AiTag>
          <AiTitle>{card.title}</AiTitle>
          <AiDetail>{card.detail}</AiDetail>
        </AiCardBase>
      );
    };

    if (!top) return null;

    return (
      <AiStackWrap>
        {top ? <Card card={top} interactive /> : null}
        {second ? <Card card={second} interactive /> : null}
        {third ? <Card card={third} interactive /> : null}
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
        const isClientsAtRisk = w.type === "ClientsAtRisk";
        const isActiveProjects = w.type === "ActiveProjects";
        return (
          <WidgetContainerWeb
            key={w.id}
            title={def?.title ?? w.type}
            category={def?.category ?? "work"}
            description={def?.description}
            titleAfter={
              isClientsAtRisk ? (
                <HeaderBadge $tone={clientsAtRiskCount ? "danger" : "neutral"}>{clientsAtRiskCount}</HeaderBadge>
              ) : isActiveProjects ? (
                <HeaderBadge $tone={"neutral"}>{activeProjectsCount}</HeaderBadge>
              ) : undefined
            }
            headerRight={isClientsAtRisk ? <Muted>{clientsAtRiskMeter}</Muted> : undefined}
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
