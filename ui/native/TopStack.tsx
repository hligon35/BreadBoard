import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

const Wrap = styled.View`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Row = styled.View`
  height: 52px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const Slot = styled.View`
  width: 64px;
  align-items: flex-start;
`;

const SlotRight = styled.View`
  width: 64px;
  align-items: flex-end;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
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
  const insets = useSafeAreaInsets();

  return (
    <Wrap style={{ paddingTop: insets.top }}>
      <Row>
        <Slot>{left ?? <View />}</Slot>
        <Title numberOfLines={1}>{title}</Title>
        <SlotRight>{right ?? <View />}</SlotRight>
      </Row>
    </Wrap>
  );
}
