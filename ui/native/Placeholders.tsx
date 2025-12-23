import React from "react";
import styled from "styled-components/native";
import { Card, Muted } from "./primitives";

const Box = styled.View`
  height: 160px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
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

export function TablePlaceholder({ title }: { title: string }) {
  return (
    <Card>
      <Muted>{title}</Muted>
      <Box style={{ height: 180 }}>
        <Muted>Table/list placeholder</Muted>
      </Box>
    </Card>
  );
}
