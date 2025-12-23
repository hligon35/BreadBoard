import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

export const Shell = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const H1 = styled.h1`
  font-size: ${({ theme }) => theme.typography.xl}px;
  margin: 0;
`;

export const H2 = styled.h2`
  font-size: ${({ theme }) => theme.typography.lg}px;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const Muted = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.mutedText};
`;
