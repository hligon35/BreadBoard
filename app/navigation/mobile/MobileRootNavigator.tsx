import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TopStack } from "@ui/native";

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
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          header: () => (
            <TopStack
              title={
                route.name === "Home"
                  ? "Dashboard"
                  : route.name === "Money"
                  ? "Money"
                  : route.name === "Work"
                  ? "Work"
                  : route.name === "Clients"
                  ? "Clients"
                  : "More"
              }
            />
          ),
          tabBarIcon: ({ color, size, focused }) => {
            const iconName =
              route.name === "Home"
                ? (focused ? "home" : "home-outline")
                : route.name === "Money"
                ? (focused ? "cash" : "cash-outline")
                : route.name === "Work"
                ? (focused ? "briefcase" : "briefcase-outline")
                : route.name === "Clients"
                ? (focused ? "people" : "people-outline")
                : (focused ? "menu" : "menu-outline");

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="Home" component={DashboardScreen} />
        <Tabs.Screen name="Money" component={MoneyScreen} />
        <Tabs.Screen name="Work" component={WorkScreen} />
        <Tabs.Screen name="Clients" component={ClientsScreen} />
        <Tabs.Screen name="More" component={MoreDrawer} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
