import { create } from "zustand";
import type { WidgetLayoutItem, WidgetPreset, WidgetTypeKey } from "@app/widgets/widgetTypes";
import { defaultDashboardPreset } from "@app/widgets/presets";

type DashboardState = {
  preset: WidgetPreset;
  setPreset: (preset: WidgetPreset) => void;
  setLayout: (layout: WidgetLayoutItem[]) => void;
  removeWidget: (id: string) => void;
  addWidget: (type: WidgetTypeKey) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  preset: defaultDashboardPreset,
  setPreset: (preset) => set({ preset }),
  setLayout: (layout) => set((s) => ({ preset: { ...s.preset, layout } })),
  removeWidget: (id) =>
    set((s) => ({ preset: { ...s.preset, layout: s.preset.layout.filter((w) => w.id !== id) } })),
  addWidget: (type) =>
    set((s) => ({
      preset: {
        ...s.preset,
        layout: [
          ...s.preset.layout,
          { id: `${type}_${Date.now()}`, type, size: "M" as const },
        ],
      },
    })),
}));
