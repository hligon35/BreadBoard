import React, { useMemo } from "react";
import { Card, Container, Muted, Screen, Scroll } from "@ui/native";
import { Button } from "@ui/native";
import { widgetCatalog } from "./widgetTypes";
import { useDashboardStore } from "@app/context/stores/useDashboardStore";

export function WidgetLibraryNative() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const items = useMemo(() => widgetCatalog, []);

  return (
    <Screen>
      <Scroll>
        <Container>
          <Muted>Widget library (placeholder)</Muted>
          {items.map((w) => (
            <Card key={w.type}>
              <Muted>{w.title}</Muted>
              <Muted>{w.description}</Muted>
              <Button title="Add" variant="primary" onPress={() => addWidget(w.type)} />
            </Card>
          ))}
        </Container>
      </Scroll>
    </Screen>
  );
}
