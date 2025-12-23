import React from "react";
import styled from "styled-components";
import { Button, Card, Col, H1, H2, Muted, Row } from "@ui/web";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { useUserStore } from "@app/context/stores/useUserStore";

const Flex = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
`;

export function SettingsScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode, highContrast, largeText, voiceNavEnabled, toggleHighContrast, toggleLargeText, toggleVoiceNav } =
    useThemeStore();

  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Settings</H1>
        <Muted>Profile, branding, accessibility, security (scaffold).</Muted>
      </div>

      <Row style={{ alignItems: "stretch" }}>
        <Flex $flex={1}>
          <Card>
            <H2>Profile</H2>
            <Muted>Name: {profile.displayName}</Muted>
            <Muted>Business: {profile.businessName}</Muted>
          </Card>
        </Flex>
        <Flex $flex={1}>
          <Card>
            <H2>Branding</H2>
            <Muted>Sponsor mode is placeholder</Muted>
            <Button variant="ghost" onClick={() => setMode("sponsor")}>
              Enable Sponsor Mode (mock)
            </Button>
            <Button variant="ghost" onClick={() => setMode("light")}>
              Disable Sponsor Mode
            </Button>
          </Card>
        </Flex>
      </Row>

      <Card>
        <H2>Accessibility</H2>
        <Row>
          <Button variant={highContrast ? "primary" : "ghost"} onClick={toggleHighContrast}>
            High contrast: {highContrast ? "On" : "Off"}
          </Button>
          <Button variant={largeText ? "primary" : "ghost"} onClick={toggleLargeText}>
            Large text: {largeText ? "On" : "Off"}
          </Button>
          <Button variant={voiceNavEnabled ? "primary" : "ghost"} onClick={toggleVoiceNav}>
            Voice navigation: {voiceNavEnabled ? "On" : "Off"}
          </Button>
        </Row>
        <Muted style={{ marginTop: 8 }}>Theme mode: {mode}</Muted>
      </Card>

      <Card>
        <H2>Security</H2>
        <Muted>Placeholder: security settings and access controls (no auth yet).</Muted>
      </Card>
    </Col>
  );
}

