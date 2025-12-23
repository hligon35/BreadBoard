import React from "react";
import styled from "styled-components";
import { Card, Col, H1, H2, Muted, Row, TablePlaceholder } from "@ui/web";

const Flex = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
`;

export function MarketplaceScreen() {
  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Marketplace</H1>
        <Muted>Themes, presets, and widget packs (mock).</Muted>
      </div>
      <Row style={{ alignItems: "stretch" }}>
        <Flex $flex={1}>
          <Card>
            <H2>Themes gallery</H2>
            <TablePlaceholder title="Theme packs" rows={5} />
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Layout presets</H2>
            <TablePlaceholder title="Preset packs" rows={5} />
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Widget packs</H2>
            <TablePlaceholder title="Widget packs" rows={5} />
          </Card>
        </Flex>
      </Row>
    </Col>
  );
}

