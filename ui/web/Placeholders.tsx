import React from "react";
import styled from "styled-components";
import { Card, Muted } from "./primitives";

const Box = styled.div`
  height: 160px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function ChartPlaceholder({ title }: { title: string }) {
  return (
    <Card>
      <Muted>{title}</Muted>
      <Box>
        <Muted>Chart placeholder</Muted>
      </Box>
    </Card>
  );
}

export function TablePlaceholder({ title, rows = 6 }: { title: string; rows?: number }) {
  return (
    <Card>
      <Muted>{title}</Muted>
      <Box style={{ height: 40 + rows * 22 }}>
        <Muted>Table/list placeholder</Muted>
      </Box>
    </Card>
  );
}
