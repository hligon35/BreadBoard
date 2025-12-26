import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

const Btn = styled.View<{ variant?: "primary" | "ghost" | "danger"; $disabled?: boolean }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.danger
      : "transparent"};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
`;

const Label = styled.Text<{ variant?: "primary" | "ghost" | "danger"; $disabled?: boolean }>`
  color: ${({ theme, variant }) =>
    variant === "primary" || variant === "danger" ? "#fff" : theme.colors.text};
  opacity: ${({ $disabled }) => ($disabled ? 0.9 : 1)};
`;

export function Button({
  title,
  onPress,
  variant,
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Btn variant={variant} $disabled={disabled}>
        <Label variant={variant} $disabled={disabled}>
          {title}
        </Label>
      </Btn>
    </Pressable>
  );
}
