import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Card, Col, H1, H2, Modal, Muted, Row } from "@ui/web";

import { useUserStore } from "@app/context/stores/useUserStore";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";
import { listMockPresets } from "@app/mock/services/widgetPresetsService";
import type { WidgetPreset } from "@app/widgets/widgetTypes";
import { WidgetGridWeb } from "@app/widgets/WidgetGrid.web";
import { WidgetLibraryWeb } from "@app/widgets/WidgetLibrary.web";
import { saveMockPreset } from "@app/mock/services/widgetPresetsService";

const Select = styled.select`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const MenuWrap = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs}px);
  right: 0;
  min-width: 140px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xs}px;
  z-index: 20;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.text)};
`;

const GlanceRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const GlanceBlock = styled.div`
  flex: 0 0 auto;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
`;

const GlanceLabel = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
`;

export function DashboardScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode } = useThemeStore();
  const preset = useDashboardStore((s) => s.preset);
  const setPreset = useDashboardStore((s) => s.setPreset);

  const [presets, setPresets] = useState<WidgetPreset[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [widgetsMenuOpen, setWidgetsMenuOpen] = useState(false);
  const [widgetMode, setWidgetMode] = useState<"default" | "move" | "delete">("default");

  useEffect(() => {
    listMockPresets().then(setPresets);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <Col style={{ gap: 16 }}>
      <Row style={{ justifyContent: "space-between" }}>
        <div>
          <H1>
            {greeting}, {profile.displayName}
          </H1>
          <Muted>Today at a glance</Muted>
        </div>
        <Row>
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            Theme: {mode}
          </Button>
          <MenuWrap>
            <IconButton
              aria-label="Widget actions"
              onClick={() => setWidgetsMenuOpen((v) => !v)}
            >
              ⋯
            </IconButton>
            {widgetsMenuOpen ? (
              <Menu>
                <MenuItem
                  onClick={() => {
                    setWidgetsMenuOpen(false);
                    setWidgetMode("default");
                    setLibraryOpen(true);
                  }}
                >
                  Add
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setWidgetsMenuOpen(false);
                    setWidgetMode((m) => (m === "move" ? "default" : "move"));
                  }}
                >
                  {widgetMode === "move" ? "Stop moving" : "Move"}
                </MenuItem>
                <MenuItem
                  $danger
                  onClick={() => {
                    setWidgetsMenuOpen(false);
                    setWidgetMode((m) => (m === "delete" ? "default" : "delete"));
                  }}
                >
                  {widgetMode === "delete" ? "Stop deleting" : "Delete"}
                </MenuItem>
              </Menu>
            ) : null}
          </MenuWrap>
        </Row>
      </Row>

      <GlanceRow>
        <GlanceBlock>
          <GlanceLabel>Invoices</GlanceLabel>
          <div>2 due</div>
        </GlanceBlock>
        <GlanceBlock>
          <GlanceLabel>Cashflow</GlanceLabel>
          <div>+$7.1k (30d)</div>
        </GlanceBlock>
        <GlanceBlock>
          <GlanceLabel>Tasks</GlanceLabel>
          <div>13 open</div>
        </GlanceBlock>
        <GlanceBlock>
          <GlanceLabel>Tax</GlanceLabel>
          <div>21 days</div>
        </GlanceBlock>
      </GlanceRow>

      <Card>
        <Row style={{ justifyContent: "space-between" }}>
          <div>
            <H2>Dashboard widgets</H2>
            <Muted>Drag and drop to reorder (web). Resize S/M/L (mock).</Muted>
          </div>
          <Row>
            <label>
              <Muted>Preset</Muted>
              <Select
                value={preset.id}
                onChange={(e) => {
                  const p = presets.find((x) => x.id === e.target.value);
                  if (p) setPreset(p);
                }}
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </label>
            <Button
              variant="ghost"
              onClick={async () => {
                await saveMockPreset(preset);
                window.alert("Saved preset (mock only). No backend persistence yet.");
              }}
            >
              Save preset
            </Button>
          </Row>
        </Row>

        <TopSpace>
          <WidgetGridWeb mode={widgetMode} />
        </TopSpace>
      </Card>

      <Modal open={libraryOpen} onClose={() => setLibraryOpen(false)}>
        <Row style={{ justifyContent: "space-between" }}>
          <H2>Widget library</H2>
          <Button onClick={() => setLibraryOpen(false)}>Close</Button>
        </Row>
        <TopSpace>
          <WidgetLibraryWeb onAdded={() => setLibraryOpen(false)} />
        </TopSpace>
      </Modal>
    </Col>
  );
}

