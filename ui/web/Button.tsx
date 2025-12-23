import styled from "styled-components";

export const Button = styled.button<{ variant?: "primary" | "ghost" | "danger" }>`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "danger"
      ? theme.colors.danger
      : "transparent"};
  color: ${({ theme, variant }) =>
    variant === "primary" || variant === "danger" ? "#fff" : theme.colors.text};
  cursor: pointer;
`;
