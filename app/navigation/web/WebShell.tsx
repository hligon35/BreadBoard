import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { Page, Shell, Sidebar, Main, H2, Muted, Row } from "@ui/web";

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const Item = styled(NavLink)`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &.active {
    background: ${({ theme }) => theme.colors.bg};
    border-color: ${({ theme }) => theme.colors.border};
  }
`;

export function WebShell({ children }: { children: React.ReactNode }) {
  return (
    <Page>
      <Shell>
        <Sidebar>
          <Row style={{ justifyContent: "space-between" }}>
            <div>
              <H2>Bread Board</H2>
              <Muted>Power Your Freelance Flow.</Muted>
            </div>
          </Row>
          <NavList>
            <Item to="/dashboard">Dashboard</Item>
            <Item to="/money">Money</Item>
            <Item to="/work">Work</Item>
            <Item to="/clients">Clients</Item>
            <Item to="/compliance">Compliance</Item>
            <Item to="/insights">Insights</Item>
            <Item to="/marketplace">Marketplace</Item>
            <Item to="/settings">Settings</Item>
          </NavList>
        </Sidebar>
        <Main>{children}</Main>
      </Shell>
    </Page>
  );
}
