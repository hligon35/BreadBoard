import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DashboardScreen } from "@app/screens/DashboardScreen.native";
import { MoneyScreen } from "@app/screens/MoneyScreen.native";
import { WorkScreen } from "@app/screens/WorkScreen.native";
import { ClientsScreen } from "@app/screens/ClientsScreen.native";
import { ComplianceScreen } from "@app/screens/ComplianceScreen.native";
import { InsightsScreen } from "@app/screens/InsightsScreen.native";
import { MarketplaceScreen } from "@app/screens/MarketplaceScreen.native";
import { SettingsScreen } from "@app/screens/SettingsScreen.native";

type RootTabsParamList = {
  Home: undefined;
  Money: undefined;
  Work: undefined;
  Clients: undefined;
  More: undefined;
};

const Tabs = createBottomTabNavigator<RootTabsParamList>();
const Drawer = createDrawerNavigator();

function MoreDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Compliance" component={ComplianceScreen} />
      <Drawer.Screen name="Insights" component={InsightsScreen} />
      <Drawer.Screen name="Marketplace" component={MarketplaceScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export function MobileRootNavigator() {
  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen name="Home" component={DashboardScreen} />
        <Tabs.Screen name="Money" component={MoneyScreen} />
        <Tabs.Screen name="Work" component={WorkScreen} />
        <Tabs.Screen name="Clients" component={ClientsScreen} />
        <Tabs.Screen name="More" component={MoreDrawer} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
