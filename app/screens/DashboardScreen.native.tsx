import React, { useMemo, useState } from "react";
import { Alert } from "react-native";

import { Button, Card, Chip, Container, H1, H2, Muted, Row, Screen, Scroll } from "@ui/native";
import { useUserStore } from "@app/context/stores/useUserStore";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { WidgetGridNative } from "@app/widgets/WidgetGrid.native";

export function DashboardScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode } = useThemeStore();
  const [libraryOpen, setLibraryOpen] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <Screen>
      <Scroll>
        <Container>
          <Row style={{ justifyContent: "space-between" }}>
            <H1>
              {greeting}, {profile.displayName}
            </H1>
            <Button
              title={`Theme: ${mode}`}
              onPress={() => setMode(mode === "light" ? "dark" : "light")}
            />
          </Row>

          <Muted>Today at a glance</Muted>
          <Row>
            <Chip>Invoices: 2 due</Chip>
            <Chip>Cashflow: +$7.1k (30d)</Chip>
            <Chip>Tasks: 13 open</Chip>
            <Chip>Tax: 21 days</Chip>
          </Row>

          <Card>
            <Row style={{ justifyContent: "space-between" }}>
              <H2>Dashboard widgets</H2>
              <Button title="Add widgets" variant="primary" onPress={() => {
                setLibraryOpen(true);
                Alert.alert("Widget Library", "Placeholder: open widget library modal/drawer later.");
              }} />
            </Row>
            <Muted>Mobile drag/resize is scaffolded (placeholder).</Muted>
            <WidgetGridNative />
          </Card>
        </Container>
      </Scroll>
    </Screen>
  );
}
