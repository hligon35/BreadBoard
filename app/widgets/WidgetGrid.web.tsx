import React, { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";

import { Muted } from "@ui/web";
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

const StrongText = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
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
  const setWidgetSize = useDashboardStore((s) => s.setWidgetSize);

  const [dragId, setDragId] = useState<string | null>(null);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);
  const theme = useTheme();

  const Text = ({ children }: { children: React.ReactNode }) => <Muted>{children}</Muted>;
  const RingSub = ({ children }: { children: React.ReactNode }) => <RingSubText>{children}</RingSubText>;
  const RingValue = ({ children }: { children: React.ReactNode }) => <RingValueText>{children}</RingValueText>;

  const TaxRing = ({ progress, children }: { progress: number; children: React.ReactNode }) => {
    const p = Math.max(0, Math.min(1, progress));
    const deg = Math.round(p * 360);
    return (
      <Ring $deg={deg} $color={theme.colors.category.compliance}>
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
  const Tag = ({ tone, children }: { tone: "danger" | "warning" | "success"; children: React.ReactNode }) => (
    <ToneTag $tone={tone}>{children}</ToneTag>
  );
  const Shelf = ({ children }: { children: React.ReactNode }) => <BadgeShelfRow>{children}</BadgeShelfRow>;
  const Pill = ({ label }: { label: string }) => <BadgePill>{label}</BadgePill>;

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
            BadgeShelf={Shelf}
            BadgePill={Pill}
          />
        );
    }
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
            size={w.size}
            span={span}
            isDragSource={dragId === w.id}
            onDelete={() => removeWidget(w.id)}
            onMove={() => {
              // Highlights the card; user can drag it to reorder.
              setDragId(w.id);
            }}
            onResize={(size) => setWidgetSize(w.id, size)}
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
