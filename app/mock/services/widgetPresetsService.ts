import type { WidgetPreset } from "@app/widgets/widgetTypes";
import { defaultDashboardPreset } from "@app/widgets/presets";

export async function listMockPresets(): Promise<WidgetPreset[]> {
  return [
    defaultDashboardPreset,
    {
      id: "preset_focus_money",
      name: "Money Focus",
      layout: [
        { id: "w_income", type: "IncomeExpense", size: "L" },
        { id: "w_cash", type: "CashFlow", size: "M" },
        { id: "w_tax", type: "TaxCountdown", size: "M" },
      ],
    },
  ];
}

export async function saveMockPreset(preset: WidgetPreset): Promise<{ ok: true }>{
  void preset;
  return { ok: true };
}
