import React from "react";
import { Card, Muted, Row } from "@ui/native";
import { Button } from "@ui/native";
import type { WidgetSize } from "./widgetTypes";
import styled from "styled-components/native";
import type { CategoryKey } from "@app/theme/tokens";

const AccentBar = styled.View<{ $category: CategoryKey }>`
  height: 6px;
  border-top-left-radius: ${({ theme }) => theme.radius.md}px;
  border-top-right-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme, $category }) => theme.colors.category[$category]};
  margin: ${({ theme }) => -theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export function WidgetContainerNative({
  title,
  category,
  description,
  size,
  onResize,
  children,
}: {
  title: string;
  category: CategoryKey;
  description?: string;
  size: WidgetSize;
  onResize: (size: WidgetSize) => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <AccentBar $category={category} />
      <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Title>{title}</Title>
        <Row>
          <Button title={`Size: ${size}`} onPress={() => onResize(size === "S" ? "M" : size === "M" ? "L" : "S")} />
        </Row>
      </Row>
      {description ? <Muted>{description}</Muted> : null}
      <Row style={{ marginTop: 10, alignItems: "flex-start" }}>{children}</Row>
    </Card>
  );
}
