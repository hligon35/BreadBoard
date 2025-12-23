import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { WebShell } from "@app/navigation/web/WebShell";
import { DashboardScreen } from "@app/screens/DashboardScreen.web";
import { MoneyScreen } from "@app/screens/MoneyScreen.web";
import { WorkScreen } from "@app/screens/WorkScreen.web";
import { ClientsScreen } from "@app/screens/ClientsScreen.web";
import { ComplianceScreen } from "@app/screens/ComplianceScreen.web";
import { InsightsScreen } from "@app/screens/InsightsScreen.web";
import { MarketplaceScreen } from "@app/screens/MarketplaceScreen.web";
import { SettingsScreen } from "@app/screens/SettingsScreen.web";

export function WebApp() {
  return (
    <WebShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/money" element={<MoneyScreen />} />
        <Route path="/work" element={<WorkScreen />} />
        <Route path="/clients" element={<ClientsScreen />} />
        <Route path="/compliance" element={<ComplianceScreen />} />
        <Route path="/insights" element={<InsightsScreen />} />
        <Route path="/marketplace" element={<MarketplaceScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </WebShell>
  );
}
