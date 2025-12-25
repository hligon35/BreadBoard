import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Row = styled.div`
  height: 56px;
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.xl}px;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Slot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
`;

const SlotRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
`;

export function TopStack({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <Wrap>
      <Row>
        <Slot>{left ?? null}</Slot>
        <Title>{title}</Title>
        <SlotRight>{right ?? null}</SlotRight>
      </Row>
    </Wrap>
  );
}
