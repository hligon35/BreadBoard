import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Card, Container, H1, H2, Muted, Screen, Scroll } from "@ui/native";
import { listMockMarketplacePacks } from "@app/mock/services/marketplaceService";
import type { MockMarketplacePack } from "@app/mock/data/mockDb";

const Col = styled.View`
  flex-direction: column;
  gap: 10px;
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
    <Screen>
      <Scroll>
        <Container>
          <H1>Marketplace</H1>
          <Muted>Themes, presets, and widget packs (mock)</Muted>
          <Card>
            <H2>Themes gallery</H2>
            <Col style={{ marginTop: 10 }}>
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
          <Card>
            <H2>Layout presets</H2>
            <Col style={{ marginTop: 10 }}>
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
          <Card>
            <H2>Widget packs</H2>
            <Col style={{ marginTop: 10 }}>
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
        </Container>
      </Scroll>
    </Screen>
  );
}
