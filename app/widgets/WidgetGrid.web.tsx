import React, { useMemo, useState } from "react";
import styled from "styled-components";

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

function spanFor(size: WidgetSize) {
  if (size === "S") return 1;
  if (size === "M") return 2;
  return 3;
}

function renderWidget(type: WidgetLayoutItem["type"]) {
  const Text = ({ children }: { children: React.ReactNode }) => <Muted>{children}</Muted>;
  switch (type) {
    case "IncomeExpense":
      return <IncomeExpenseWidget Text={Text} />;
    case "TaxCountdown":
      return <TaxCountdownWidget Text={Text} />;
    case "ClientsAtRisk":
      return <ClientsAtRiskWidget Text={Text} />;
    case "ActiveProjects":
      return <ActiveProjectsWidget Text={Text} />;
    case "Mileage":
      return <MileageWidget Text={Text} />;
    case "CashFlow":
      return <CashFlowWidget Text={Text} />;
    case "AISuggestions":
      return <AISuggestionsWidget Text={Text} />;
    case "Badges":
      return <BadgesWidget Text={Text} />;
  }
}

export function WidgetGridWeb() {
  const layout = useDashboardStore((s) => s.preset.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const setWidgetSize = useDashboardStore((s) => s.setWidgetSize);

  const [dragId, setDragId] = useState<string | null>(null);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);

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
            description={def?.description}
            size={w.size}
            span={span}
            isDragSource={dragId === w.id}
            onDelete={() => removeWidget(w.id)}
            onResize={(size) => setWidgetSize(w.id, size)}
            draggableProps={{
              draggable: true,
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
