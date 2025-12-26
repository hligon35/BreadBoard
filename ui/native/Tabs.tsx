import React from "react";
import styled from "styled-components/native";

import { Row } from "./primitives";

export type TabItem = { key: string; label: string; badge?: number | string | null };

const TabBtn = styled.Pressable<{ $active?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
`;

const TabInner = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TabLabel = styled.Text<{ $active?: boolean }>`
  color: ${({ theme, $active }) => ($active ? "#fff" : theme.colors.text)};
`;

const Badge = styled.View`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const BadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`;

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
        <TabBtn key={it.key} $active={it.key === activeKey} onPress={() => onChange(it.key)}>
          <TabInner>
            <TabLabel $active={it.key === activeKey}>{it.label}</TabLabel>
            {it.badge !== undefined && it.badge !== null && (
              <Badge>
                <BadgeText>{it.badge}</BadgeText>
              </Badge>
            )}
          </TabInner>
        </TabBtn>
      ))}
    </Row>
  );
}
