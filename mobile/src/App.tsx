import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProviders } from "@app/context/AppProviders";
import { MobileRootNavigator } from "@app/navigation/mobile/MobileRootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <StatusBar style="auto" />
        <MobileRootNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}
