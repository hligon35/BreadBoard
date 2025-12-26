import React, { useEffect, useMemo, useState } from "react";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

export function BadgesWidget({
  Text,
  StrongText,
  ProgressRing,
  BadgeShelf,
  BadgePill,
  Row,
  Button,
  Tap,
  FullScreen,
  Wrap,
  Section,
  Meter,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  ProgressRing?: React.ComponentType<{ progress: number; children: React.ReactNode }>;
  BadgeShelf?: React.ComponentType<{ children: React.ReactNode }>;
  BadgePill?: React.ComponentType<{ label: string }>;
  Row?: React.ComponentType<{ children: React.ReactNode; style?: any }>;
  Button?: React.ComponentType<{ title: string; onPress: () => void; variant?: "primary" | "ghost" | "danger" }>;
  Tap?: React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;
  FullScreen?: React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;
  Wrap?: React.ComponentType<{ children: React.ReactNode }>;
  Section?: React.ComponentType<{ title: string; children: React.ReactNode }>;
  Meter?: React.ComponentType<{ progress: number; tone?: "success" | "warning" | "danger" }>;
}) {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  const [open, setOpen] = useState(false);

  const CenterRow: React.ComponentType<{ children: React.ReactNode }> = ({ children }) =>
    Row ? <Row style={{ justifyContent: "center", width: "100%" }}>{children}</Row> : <>{children}</>;

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  const Strong = StrongText ?? Text;
  const pct = overview ? Math.round(Math.max(0, Math.min(1, overview.nextBadgeProgress)) * 100) : 0;

  const levelTitle = useMemo(() => {
    const n = overview?.gamificationLevel;
    if (n === 1) return "Starter";
    if (n === 2) return "Maker";
    if (n === 3) return "Builder";
    if (n === 4) return "Operator";
    if (n === 5) return "Strategist";
    return "Builder";
  }, [overview?.gamificationLevel]);

  const badgeIcon = useMemo(() => {
    if (!overview) return "🏅";
    const earned = overview.earnedBadges.includes(overview.nextBadgeLabel);
    return earned ? "🏅" : "🎯";
  }, [overview]);

  const xpProgress = useMemo(() => {
    if (!overview) return 0;
    const denom = Math.max(1, overview.xpNextLevelPoints);
    return Math.max(0, Math.min(1, overview.xpPoints / denom));
  }, [overview]);

  const dashboardLabel = overview ? `Level ${overview.gamificationLevel}: ${levelTitle}` : "Level —";

  if (!overview) return <Text>Loading…</Text>;

  const Dashboard = (
    <>
      {Row && ProgressRing ? (
        <Row>
          <Text>
            {badgeIcon} {dashboardLabel}
          </Text>
          <ProgressRing progress={overview.nextBadgeProgress}>
            <Strong>{pct}%</Strong>
          </ProgressRing>
        </Row>
      ) : (
        <>
          <Text>
            {badgeIcon} {dashboardLabel}
          </Text>
          {ProgressRing ? (
            <ProgressRing progress={overview.nextBadgeProgress}>
              <Strong>{pct}%</Strong>
            </ProgressRing>
          ) : (
            <Text>Progress: {pct}%</Text>
          )}
        </>
      )}
    </>
  );

  const Full = Wrap && Section ? (
    <Wrap>
      <Section title="Progress">
        {ProgressRing ? (
          <CenterRow>
            <Text>
              {badgeIcon} {dashboardLabel}
            </Text>
            <ProgressRing progress={overview.nextBadgeProgress}>
              <Strong>{pct}%</Strong>
            </ProgressRing>
          </CenterRow>
        ) : (
          <>
            <Text>
              {badgeIcon} {dashboardLabel}
            </Text>
            <CenterRow>
              <Text>Next: {overview.nextBadgeLabel}</Text>
            </CenterRow>
          </>
        )}
      </Section>

      <Section title="Badge shelf">
        {BadgeShelf && BadgePill ? (
          <BadgeShelf>
            {overview.earnedBadges.map((b) => (
              <BadgePill key={b} label={b} />
            ))}
          </BadgeShelf>
        ) : (
          <Text>{overview.earnedBadges.join(" • ")}</Text>
        )}
      </Section>

      <Section title="Experience Points">
        {Row ? (
          <CenterRow>
            <Text>Current streak: {overview.streakDays} days</Text>
            <Text>
              {overview.xpPoints} / {overview.xpNextLevelPoints} XP
            </Text>
          </CenterRow>
        ) : (
          <>
            <Text>Current streak: {overview.streakDays} days</Text>
            <Text>
              {overview.xpPoints} / {overview.xpNextLevelPoints} XP
            </Text>
          </>
        )}
        {Meter ? (
          <>
            <Meter progress={xpProgress} tone={"success"} />
            <CenterRow>
              <Text>
                <Strong>{Math.round(xpProgress * 100)}%</Strong> to next level
              </Text>
            </CenterRow>
          </>
        ) : (
          <CenterRow>
            <Text>{Math.round(xpProgress * 100)}% to next level</Text>
          </CenterRow>
        )}
      </Section>

      <Section title="Roadmap panel">
        {overview.upcomingAchievements.length ? (
          overview.upcomingAchievements.map((a) => (
            <CenterRow key={a}>
              <Text>• {a}</Text>
            </CenterRow>
          ))
        ) : (
          <CenterRow>
            <Text>• {overview.nextBadgeLabel}</Text>
          </CenterRow>
        )}
      </Section>

      <Section title="Social share">
        {Row && Button ? (
          <CenterRow>
            <Button title="💼 LinkedIn" variant="primary" onPress={() => {}} />
            <Button title="📘 Facebook" variant="ghost" onPress={() => {}} />
            <Button title="📸 Instagram" variant="ghost" onPress={() => {}} />
          </CenterRow>
        ) : Button ? (
          <>
            <Button title="💼 LinkedIn" variant="primary" onPress={() => {}} />
            <Button title="📘 Facebook" variant="ghost" onPress={() => {}} />
            <Button title="📸 Instagram" variant="ghost" onPress={() => {}} />
          </>
        ) : (
          <CenterRow>
            <Text>💼 LinkedIn • 📘 Facebook • 📸 Instagram</Text>
          </CenterRow>
        )}
      </Section>

      <Section title="Sponsor overlay">
        <CenterRow>
          <Text>Skillshare badge unlocked</Text>
        </CenterRow>
      </Section>
    </Wrap>
  ) : (
    <>
      <Text>
        {badgeIcon} {dashboardLabel} • Next: {overview.nextBadgeLabel} ({pct}%)
      </Text>
      <Text>Earned badges: {overview.earnedBadges.join(", ")}</Text>
      <Text>
        XP: {overview.xpPoints}/{overview.xpNextLevelPoints} • Streak: {overview.streakDays}d
      </Text>
      <Text>Upcoming: {overview.upcomingAchievements.join(", ")}</Text>
      <Text>💼 LinkedIn • 📘 Facebook • 📸 Instagram</Text>
      <Text>Skillshare badge unlocked</Text>
    </>
  );

  return (
    <>
      {Tap && FullScreen ? <Tap onPress={() => setOpen(true)}>{Dashboard}</Tap> : Dashboard}
      {FullScreen ? (
        <FullScreen open={open} onClose={() => setOpen(false)} title="Badges">
          {Full}
        </FullScreen>
      ) : null}
    </>
  );
}
