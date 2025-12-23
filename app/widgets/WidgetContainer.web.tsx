import React from "react";
import styled from "styled-components";
import { Card, Muted, Row } from "@ui/web";
import { Button } from "@ui/web";
import type { WidgetSize } from "./widgetTypes";

const Select = styled.select`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Wrap = styled(Card)<{ span: number; $isDragSource?: boolean }>`
  grid-column: span ${({ span }) => span};
  user-select: none;
  outline: ${({ theme, $isDragSource }) => ($isDragSource ? `2px dashed ${theme.colors.primary}` : "none")};
`;

export function WidgetContainerWeb({
  title,
  description,
  size,
  span,
  isDragSource,
  onDelete,
  onResize,
  draggableProps,
  children,
}: {
  title: string;
  description?: string;
  size: WidgetSize;
  span: number;
  isDragSource?: boolean;
  onDelete: () => void;
  onResize: (size: WidgetSize) => void;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <Wrap span={span} $isDragSource={isDragSource} {...draggableProps}>
      <Row style={{ justifyContent: "space-between" }}>
        <div>
          <strong>{title}</strong>
          {description ? <Muted>{description}</Muted> : null}
        </div>
        <Row>
          <label>
            <Muted>Size</Muted>
            <Select value={size} onChange={(e) => onResize(e.target.value as WidgetSize)}>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </Select>
          </label>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </Row>
      </Row>
      <TopSpace>{children}</TopSpace>
    </Wrap>
  );
}

