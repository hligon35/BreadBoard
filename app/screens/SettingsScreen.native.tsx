import React from "react";
import { Button, Card, Container, H1, H2, Muted, Screen, Scroll } from "@ui/native";
import { useThemeStore } from "@app/context/stores/useThemeStore";
import { useUserStore } from "@app/context/stores/useUserStore";

export function SettingsScreen() {
  const profile = useUserStore((s) => s.profile);
  const { mode, setMode, highContrast, largeText, voiceNavEnabled, toggleHighContrast, toggleLargeText, toggleVoiceNav } =
    useThemeStore();

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Settings</H1>

          <Card>
            <H2>Profile</H2>
            <Muted>Name: {profile.displayName}</Muted>
            <Muted>Business: {profile.businessName}</Muted>
          </Card>

          <Card>
            <H2>Branding</H2>
            <Muted>Sponsor mode is placeholder</Muted>
            <Button title="Enable Sponsor Mode (mock)" onPress={() => setMode("sponsor")} />
            <Button title="Back to Light" onPress={() => setMode("light")} />
            <Muted>Theme mode: {mode}</Muted>
          </Card>

          <Card>
            <H2>Accessibility</H2>
            <Button
              title={`High contrast: ${highContrast ? "On" : "Off"}`}
              onPress={toggleHighContrast}
              variant={highContrast ? "primary" : "ghost"}
            />
            <Button
              title={`Large text: ${largeText ? "On" : "Off"}`}
              onPress={toggleLargeText}
              variant={largeText ? "primary" : "ghost"}
            />
            <Button
              title={`Voice navigation: ${voiceNavEnabled ? "On" : "Off"}`}
              onPress={toggleVoiceNav}
              variant={voiceNavEnabled ? "primary" : "ghost"}
            />
          </Card>

          <Card>
            <H2>Security</H2>
            <Muted>Placeholder: security settings (no auth yet).</Muted>
          </Card>
        </Container>
      </Scroll>
    </Screen>
  );
}
