import React, { useMemo } from "react";
import styled from "styled-components";
import { Button, Card, Col, H2, Muted, Row } from "@ui/web";
import { widgetCatalog } from "./widgetTypes";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export function WidgetLibraryWeb({ onAdded }: { onAdded?: () => void }) {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const layout = useDashboardStore((s) => s.preset.layout);
  const items = useMemo(() => widgetCatalog, []);
  const presentTypes = useMemo(() => new Set(layout.map((w) => w.type)), [layout]);

  return (
    <Col style={{ gap: 12 }}>
      <Muted>Select a widget to add (mock).</Muted>
      <Row style={{ alignItems: "stretch" }}>
        {items.map((w) => (
          <Card key={w.type} style={{ flex: 1, minWidth: 220 }}>
            <H2>{w.title}</H2>
            <Muted>{w.description}</Muted>
            <Muted>Category: {w.category}</Muted>
            <TopSpace>
              <Button
                variant="primary"
                disabled={presentTypes.has(w.type)}
                onClick={() => {
                  if (presentTypes.has(w.type)) return;
                  addWidget(w.type);
                  onAdded?.();
                }}
              >
                Add
              </Button>
            </TopSpace>
          </Card>
        ))}
      </Row>
    </Col>
  );
}
