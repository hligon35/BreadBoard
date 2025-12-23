import React from "react";
import { Row } from "./primitives";
import { Button } from "./Button";

export type TabItem = { key: string; label: string };

export function Tabs({
  items,
  activeKey,
  onChange,
}: {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <Row>
      {items.map((it) => (
        <Button
          key={it.key}
          title={it.label}
          variant={it.key === activeKey ? "primary" : "ghost"}
          onPress={() => onChange(it.key)}
        />
      ))}
    </Row>
  );
}
