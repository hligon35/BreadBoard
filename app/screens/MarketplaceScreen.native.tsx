import React from "react";
import { Card, Container, H1, H2, Muted, Screen, Scroll, TablePlaceholder } from "@ui/native";

export function MarketplaceScreen() {
  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Marketplace</H1>
          <Muted>Themes, presets, and widget packs (mock)</Muted>
          <Card>
            <H2>Themes gallery</H2>
            <TablePlaceholder title="Theme packs" />
          </Card>
          <Card>
            <H2>Layout presets</H2>
            <TablePlaceholder title="Preset packs" />
          </Card>
          <Card>
            <H2>Widget packs</H2>
            <TablePlaceholder title="Widget packs" />
          </Card>
        </Container>
      </Scroll>
    </Screen>
  );
}
