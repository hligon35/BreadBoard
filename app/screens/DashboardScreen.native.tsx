import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";

import { Button, Card, Container, H1, H2, Muted, Row, Screen, Scroll } from "@ui/native";
import { useUserStore } from "@app/context/stores/useUserStore";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { WidgetGridNative } from "@app/widgets/WidgetGrid.native";

const GlanceScroll = styled.ScrollView.attrs({ horizontal: true, showsHorizontalScrollIndicator: false })`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const GlanceRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const GlanceBlock = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  flex-direction: column;
`;

const GlanceLabel = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const GlanceValue = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`;

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
          <GlanceScroll>
            <GlanceRow>
              <GlanceBlock>
                <GlanceLabel>Invoices</GlanceLabel>
                <GlanceValue>2 due</GlanceValue>
              </GlanceBlock>
              <GlanceBlock>
                <GlanceLabel>Cashflow</GlanceLabel>
                <GlanceValue>+$7.1k (30d)</GlanceValue>
              </GlanceBlock>
              <GlanceBlock>
                <GlanceLabel>Tasks</GlanceLabel>
                <GlanceValue>13 open</GlanceValue>
              </GlanceBlock>
              <GlanceBlock>
                <GlanceLabel>Tax</GlanceLabel>
                <GlanceValue>21 days</GlanceValue>
              </GlanceBlock>
            </GlanceRow>
          </GlanceScroll>

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
