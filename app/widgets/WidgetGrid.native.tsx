import React, { useMemo } from "react";
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

export function WidgetGridNative() {
  const layout = useDashboardStore((s) => s.preset.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const setWidgetSize = useDashboardStore((s) => s.setWidgetSize);

  const defs = useMemo(() => new Map(widgetCatalog.map((w) => [w.type, w])), []);

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
      <Muted>Reorder: use Up/Down (DnD placeholder on mobile)</Muted>
      {layout.map((w) => {
        const def = defs.get(w.type);
        return (
          <WidgetContainerNative
            key={w.id}
            title={`${def?.title ?? w.type}  (Up/Down)`}
            description={def?.description}
            size={w.size}
            onDelete={() => removeWidget(w.id)}
            onResize={(size) => setWidgetSize(w.id, size)}
          >
            {renderWidget(w.type)}
            <Muted onPress={() => move(w.id, -1)}>↑ Move up</Muted>
            <Muted onPress={() => move(w.id, 1)}>↓ Move down</Muted>
          </WidgetContainerNative>
        );
      })}
    </>
  );
}
