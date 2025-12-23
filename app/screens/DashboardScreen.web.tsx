import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Card, Chip, Col, H1, H2, Modal, Muted, Row } from "@ui/web";

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

export function DashboardScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode } = useThemeStore();
  const preset = useDashboardStore((s) => s.preset);
  const setPreset = useDashboardStore((s) => s.setPreset);

  const [presets, setPresets] = useState<WidgetPreset[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

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
          <Button variant="primary" onClick={() => setLibraryOpen(true)}>
            Add widgets
          </Button>
        </Row>
      </Row>

      <Row>
        <Chip>Invoices: 2 due</Chip>
        <Chip>Cashflow: +$7.1k (30d)</Chip>
        <Chip>Tasks: 13 open</Chip>
        <Chip>Tax: 21 days</Chip>
      </Row>

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
          <WidgetGridWeb />
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

