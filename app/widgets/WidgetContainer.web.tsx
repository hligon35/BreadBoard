import React, { useState } from "react";
import styled from "styled-components";
import { Card, Muted, Row } from "@ui/web";
import type { CategoryKey } from "@app/theme/tokens";

const TopSpace = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const MenuWrap = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs}px);
  right: 0;
  min-width: 140px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xs}px;
  z-index: 20;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.text)};
`;

const Wrap = styled(Card)<{ span: number; $isDragSource?: boolean }>`
  grid-column: span ${({ span }) => span};
  user-select: none;
  outline: ${({ theme, $isDragSource }) => ($isDragSource ? `2px dashed ${theme.colors.primary}` : "none")};
`;

const AccentBar = styled.div<{ $category: CategoryKey }>`
  height: 6px;
  border-top-left-radius: ${({ theme }) => theme.radius.md}px;
  border-top-right-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme, $category }) => theme.colors.category[$category]};
  margin: ${({ theme }) => -theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Title = styled.div`
  font-weight: 600;
`;

export function WidgetContainerWeb({
  title,
  category,
  description,
  span,
  isDragSource,
  onDelete,
  onMove,
  draggableProps,
  children,
}: {
  title: string;
  category: CategoryKey;
  description?: string;
  span: number;
  isDragSource?: boolean;
  onDelete: () => void;
  onMove: () => void;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Wrap span={span} $isDragSource={isDragSource} {...draggableProps}>
      <AccentBar $category={category} />
      <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title>{title}</Title>
          {description ? <Muted>{description}</Muted> : null}
        </div>
        <Row>
          <MenuWrap>
            <IconButton aria-label="Card actions" onClick={() => setOpen((v) => !v)}>
              ⋯
            </IconButton>
            {open ? (
              <Menu>
                <MenuItem
                  onClick={() => {
                    setOpen(false);
                    onMove();
                  }}
                >
                  Move
                </MenuItem>
                <MenuItem
                  $danger
                  onClick={() => {
                    setOpen(false);
                    onDelete();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            ) : null}
          </MenuWrap>
        </Row>
      </Row>
      <TopSpace>{children}</TopSpace>
    </Wrap>
  );
}

