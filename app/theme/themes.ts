import type { AppTheme, ThemeMode } from "./tokens";

const base = {
  radius: { sm: 10, md: 14, lg: 18 },
  spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
  typography: { base: 14, lg: 16, xl: 20 },
} as const;

export function getTheme(mode: ThemeMode): AppTheme {
  if (mode === "dark") {
    return {
      mode,
      ...base,
      colors: {
        bg: "#0B0F19",
        surface: "#121A2A",
        text: "#EAF0FF",
        mutedText: "#A6B1C9",
        border: "#23314E",
        primary: "#7AA7FF",
        danger: "#FF6B6B",
        success: "#43E6B0",
        warning: "#FFC14D",
        category: {
          money: "#2DD4BF",
          work: "#60A5FA",
          clients: "#A78BFA",
          compliance: "#FBBF24",
          insights: "#34D399",
          marketplace: "#F472B6",
          settings: "#94A3B8",
        },
      },
    };
  }

  if (mode === "sponsor") {
    return {
      mode,
      ...base,
      colors: {
        bg: "#0A0A0A",
        surface: "#111111",
        text: "#FFFFFF",
        mutedText: "#CFCFCF",
        border: "#2A2A2A",
        primary: "#FFFFFF",
        danger: "#FF6B6B",
        success: "#43E6B0",
        warning: "#FFC14D",
        category: {
          money: "#FFFFFF",
          work: "#FFFFFF",
          clients: "#FFFFFF",
          compliance: "#FFFFFF",
          insights: "#FFFFFF",
          marketplace: "#FFFFFF",
          settings: "#FFFFFF",
        },
      },
    };
  }

  return {
    mode: "light",
    ...base,
    colors: {
      bg: "#F6F7FB",
      surface: "#FFFFFF",
      text: "#0B1020",
      mutedText: "#5A647A",
      border: "#E2E7F2",
      primary: "#2F6BFF",
      danger: "#E11D48",
      success: "#059669",
      warning: "#D97706",
      category: {
        money: "#0D9488",
        work: "#2563EB",
        clients: "#7C3AED",
        compliance: "#B45309",
        insights: "#047857",
        marketplace: "#DB2777",
        settings: "#475569",
      },
    },
  };
}
