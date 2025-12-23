import React from "react";
import { Card, Muted, Row } from "@ui/native";
import { Button } from "@ui/native";
import type { WidgetSize } from "./widgetTypes";

export function WidgetContainerNative({
  title,
  description,
  size,
  onDelete,
  onResize,
  children,
}: {
  title: string;
  description?: string;
  size: WidgetSize;
  onDelete: () => void;
  onResize: (size: WidgetSize) => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Row style={{ justifyContent: "space-between" }}>
        <Muted>{title}</Muted>
        <Row>
          <Button title={`Size: ${size}`} onPress={() => onResize(size === "S" ? "M" : size === "M" ? "L" : "S")} />
          <Button title="Del" variant="danger" onPress={onDelete} />
        </Row>
      </Row>
      {description ? <Muted>{description}</Muted> : null}
      <Row style={{ marginTop: 10, alignItems: "flex-start" }}>{children}</Row>
    </Card>
  );
}
