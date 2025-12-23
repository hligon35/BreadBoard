import styled from "styled-components/native";

export const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.bg};
`;

export const Scroll = styled.ScrollView`
  flex: 1;
`;

export const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const Card = styled.View`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  flex-wrap: wrap;
`;

export const H1 = styled.Text`
  font-size: ${({ theme }) => theme.typography.xl}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const H2 = styled.Text`
  font-size: ${({ theme }) => theme.typography.lg}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Muted = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
`;
