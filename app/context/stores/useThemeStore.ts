import { create } from "zustand";
import type { ThemeMode } from "@app/theme/tokens";

export type ThemeState = {
  mode: ThemeMode;
  highContrast: boolean;
  largeText: boolean;
  voiceNavEnabled: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleVoiceNav: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  highContrast: false,
  largeText: false,
  voiceNavEnabled: false,
  setMode: (mode) => set({ mode }),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
  toggleVoiceNav: () => set((s) => ({ voiceNavEnabled: !s.voiceNavEnabled })),
}));
