import styled from "styled-components/native";

export const Chip = styled.Text`
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;
