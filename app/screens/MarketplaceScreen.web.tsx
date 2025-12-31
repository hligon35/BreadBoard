import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Col, H1, H2, Muted, Row } from "@ui/web";
import { listMockMarketplacePacks } from "@app/mock/services/marketplaceService";
import type { MockMarketplacePack } from "@app/mock/data/mockDb";

const Flex = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
`;

export function MarketplaceScreen() {
  const [packs, setPacks] = useState<MockMarketplacePack[]>([]);

  useEffect(() => {
    listMockMarketplacePacks().then(setPacks);
  }, []);

  const themes = packs.filter((p) => p.kind === "theme");
  const presets = packs.filter((p) => p.kind === "preset");
  const widgets = packs.filter((p) => p.kind === "widget");

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
            <Col style={{ gap: 10, marginTop: 10 }}>
              {themes.map((p) => (
                <Card key={p.id}>
                  <Muted>
                    {p.name} • {p.priceLabel}
                  </Muted>
                  <Muted>{p.description}</Muted>
                </Card>
              ))}
              {!themes.length && <Muted>Loading…</Muted>}
            </Col>
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Layout presets</H2>
            <Col style={{ gap: 10, marginTop: 10 }}>
              {presets.map((p) => (
                <Card key={p.id}>
                  <Muted>
                    {p.name} • {p.priceLabel}
                  </Muted>
                  <Muted>{p.description}</Muted>
                </Card>
              ))}
              {!presets.length && <Muted>Loading…</Muted>}
            </Col>
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Widget packs</H2>
            <Col style={{ gap: 10, marginTop: 10 }}>
              {widgets.map((p) => (
                <Card key={p.id}>
                  <Muted>
                    {p.name} • {p.priceLabel}
                  </Muted>
                  <Muted>{p.description}</Muted>
                </Card>
              ))}
              {!widgets.length && <Muted>Loading…</Muted>}
            </Col>
          </Card>
        </Flex>
      </Row>
    </Col>
  );
}

