import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { useTheme } from "styled-components/native";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { widgetCatalog } from "./widgetTypes";
import type { WidgetLayoutItem } from "./widgetTypes";
import { WidgetContainerNative } from "./WidgetContainer.native";
import { Muted } from "@ui/native";

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

const StrongText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
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
  const setWidgetSize = useDashboardStore((s) => s.setWidgetSize);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);
  const theme = useTheme();

  const Text = ({ children }: { children: React.ReactNode }) => <Muted>{children}</Muted>;

  const RingSub = ({ children }: { children: React.ReactNode }) => <RingSubText>{children}</RingSubText>;
  const RingValue = ({ children }: { children: React.ReactNode }) => <RingValueText>{children}</RingValueText>;

  const TaxRing = ({ progress, children }: { progress: number; children: React.ReactNode }) => (
    <ProgressRingNative progress={progress} color={theme.colors.category.compliance}>
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

  const renderWidget = (type: WidgetLayoutItem["type"]) => {
    switch (type) {
      case "IncomeExpense":
        return <IncomeExpenseWidget Text={Text} />;
      case "TaxCountdown":
        return <TaxCountdownWidget Text={RingSub} ValueText={RingValue} ProgressRing={TaxRing} />;
      case "ClientsAtRisk":
        return <ClientsAtRiskWidget Text={Text} StrongText={StrongText} Row={Row} Tag={Tag} />;
      case "ActiveProjects":
        return <ActiveProjectsWidget Text={Text} />;
      case "Mileage":
        return <MileageWidget Text={Text} />;
      case "CashFlow":
        return <CashFlowWidget Text={Text} />;
      case "AISuggestions":
        return <AISuggestionsWidget Text={Text} />;
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
            size={w.size}
            onResize={(size) => setWidgetSize(w.id, size)}
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
