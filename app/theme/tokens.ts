export type ThemeMode = "light" | "dark" | "sponsor";

export type CategoryKey =
  | "money"
  | "work"
  | "clients"
  | "compliance"
  | "insights"
  | "marketplace"
  | "settings";

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    bg: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    danger: string;
    success: string;
    warning: string;
    category: Record<CategoryKey, string>;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    base: number;
    lg: number;
    xl: number;
  };
};
