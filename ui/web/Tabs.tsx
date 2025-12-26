import React from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Row } from "./primitives";

const TabWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: wrap;
`;

const TabLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.base - 2}px;
`;

export type TabItem = { key: string; label: string; badge?: number | string | null };

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
            <TabLabel>
              <span>{it.label}</span>
              {it.badge !== undefined && it.badge !== null && <Badge>{it.badge}</Badge>}
            </TabLabel>
          </Button>
        ))}
      </TabWrap>
    </Row>
  );
}
