import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProviders } from "@app/context/AppProviders";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { getTheme } from "@app/theme/themes";
import { MobileRootNavigator } from "@app/navigation/mobile/MobileRootNavigator";

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const theme = getTheme(mode);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar
            style={mode === "light" ? "dark" : "light"}
            backgroundColor={theme.colors.surface}
          />
          <MobileRootNavigator />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
