import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components";

import { getTheme } from "@app/theme/themes";
import { useThemeStore } from "@app/context/stores/useThemeStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const largeText = useThemeStore((s) => s.largeText);
  const highContrast = useThemeStore((s) => s.highContrast);

  const theme = useMemo(() => {
    const t = getTheme(mode);
    const typographyScale = largeText ? 1.15 : 1;
    return {
      ...t,
      typography: {
        base: Math.round(t.typography.base * typographyScale),
        lg: Math.round(t.typography.lg * typographyScale),
        xl: Math.round(t.typography.xl * typographyScale),
      },
      a11y: { largeText, highContrast },
    };
  }, [mode, largeText, highContrast]);

  return <ThemeProvider theme={theme as any}>{children}</ThemeProvider>;
}
