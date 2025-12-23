import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

const Btn = styled.View<{ variant?: "primary" | "ghost" | "danger" }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.danger
      : "transparent"};
`;

const Label = styled.Text<{ variant?: "primary" | "ghost" | "danger" }>`
  color: ${({ theme, variant }) =>
    variant === "primary" || variant === "danger" ? "#fff" : theme.colors.text};
`;

export function Button({
  title,
  onPress,
  variant,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <Pressable onPress={onPress}>
      <Btn variant={variant}>
        <Label variant={variant}>{title}</Label>
      </Btn>
    </Pressable>
  );
}
