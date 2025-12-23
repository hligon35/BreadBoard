import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Row } from "./primitives";

const TabWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: wrap;
`;

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
      <TabWrap>
        {items.map((it) => (
          <Button
            key={it.key}
            variant={it.key === activeKey ? "primary" : "ghost"}
            onClick={() => onChange(it.key)}
          >
            {it.label}
          </Button>
        ))}
      </TabWrap>
    </Row>
  );
}
