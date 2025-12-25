import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

import { Button, Card, Container, H1, H2, Muted, Row, Screen, Scroll } from "@ui/native";
import { useUserStore } from "@app/context/stores/useUserStore";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { WidgetGridNative } from "@app/widgets/WidgetGrid.native";
import { widgetCatalog } from "@app/widgets/widgetTypes";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";

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

const MenuWrap = styled.View`
  position: relative;
`;

const IconButton = styled(Pressable)`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
`;

const IconButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`;

const Menu = styled.View`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 160px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xs}px;
  z-index: 20;
`;

const MenuItem = styled(Pressable)<{ $danger?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const MenuItemText = styled.Text<{ $danger?: boolean }>`
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.text)};
`;

export function DashboardScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode } = useThemeStore();
  const addWidget = useDashboardStore((s) => s.addWidget);

  const [widgetMode, setWidgetMode] = useState<"default" | "move" | "delete">("default");
  const [addOpen, setAddOpen] = useState(false);
  const [widgetsMenuOpen, setWidgetsMenuOpen] = useState(false);

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
              <MenuWrap>
                <IconButton onPress={() => setWidgetsMenuOpen((v) => !v)}>
                  <IconButtonText>⋯</IconButtonText>
                </IconButton>
                {widgetsMenuOpen ? (
                  <Menu>
                    <MenuItem
                      onPress={() => {
                        setWidgetsMenuOpen(false);
                        setAddOpen((v) => !v);
                        setWidgetMode("default");
                      }}
                    >
                      <MenuItemText>{addOpen ? "Close add" : "Add"}</MenuItemText>
                    </MenuItem>
                    <MenuItem
                      onPress={() => {
                        setWidgetsMenuOpen(false);
                        setAddOpen(false);
                        setWidgetMode((m) => (m === "move" ? "default" : "move"));
                      }}
                    >
                      <MenuItemText>{widgetMode === "move" ? "Stop moving" : "Move"}</MenuItemText>
                    </MenuItem>
                    <MenuItem
                      onPress={() => {
                        setWidgetsMenuOpen(false);
                        setAddOpen(false);
                        setWidgetMode((m) => (m === "delete" ? "default" : "delete"));
                      }}
                    >
                      <MenuItemText $danger>{widgetMode === "delete" ? "Stop deleting" : "Delete"}</MenuItemText>
                    </MenuItem>
                  </Menu>
                ) : null}
              </MenuWrap>
            </Row>

            {addOpen ? (
              <>
                <Muted>Tap Add to insert a widget.</Muted>
                {widgetCatalog.map((w) => (
                  <Row key={w.type} style={{ justifyContent: "space-between" }}>
                    <Muted>{w.title}</Muted>
                    <Button title="Add" variant="primary" onPress={() => addWidget(w.type)} />
                  </Row>
                ))}
              </>
            ) : (
              widgetMode === "move" ? <Muted>Move mode: use Up/Down controls.</Muted> : null
            )}

            <WidgetGridNative mode={widgetMode} />
          </Card>
        </Container>
      </Scroll>
    </Screen>
  );
}
