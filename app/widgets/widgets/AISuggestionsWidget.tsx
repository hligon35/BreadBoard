import React, { useEffect, useMemo, useState } from "react";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import type { AISuggestion } from "@app/context/stores/useInsightsStore";

export function AISuggestionsWidget({
  Text,
  StrongText,
  CardStack,
  Row,
  Button,
  Tap,
  FullScreen,
  Wrap,
  Section,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  CardStack?: React.ComponentType<{
    cards: AISuggestion[];
    onDo: (id: string) => void;
    onDismiss: (id: string) => void;
  }>;
  Row?: React.ComponentType<{ children: React.ReactNode }>;
  Button?: React.ComponentType<{ title: string; onPress: () => void; variant?: "primary" | "ghost" | "danger" }>;
  Tap?: React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;
  FullScreen?: React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;
  Wrap?: React.ComponentType<{ children: React.ReactNode }>;
  Section?: React.ComponentType<{ title: string; children: React.ReactNode }>;
}) {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  const addToBoard = useWorkStore((s) => s.addToBoard);

  const [dismissed, setDismissed] = useState<Record<string, true>>({});
  const [open, setOpen] = useState(false);
  const [sponsor, setSponsor] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"All" | AISuggestion["category"]>("All");
  const [filterUrgency, setFilterUrgency] = useState<"All" | AISuggestion["urgency"]>("All");
  const [filterImpact, setFilterImpact] = useState<"All" | AISuggestion["impact"]>("All");
  const [carousel, setCarousel] = useState<string[]>([]);

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  const remaining = useMemo(() => {
    const list = overview?.aiSuggestions ?? [];
    return list.filter((s) => !dismissed[s.id]);
  }, [overview, dismissed]);

  useEffect(() => {
    if (!overview) return;
    const first3 = remaining.slice(0, 3).map((s) => s.id);
    setCarousel((prev) => {
      const prevSet = new Set(prev);
      const next = first3.filter((id) => prevSet.has(id));
      const missing = first3.filter((id) => !prevSet.has(id));
      const merged = [...next, ...missing];
      return merged.length ? merged : first3;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview, remaining.map((s) => s.id).join("|")]);

  const carouselCards = useMemo(() => {
    if (!overview) return [];
    const byId = new Map(remaining.map((s) => [s.id, s] as const));
    return carousel.map((id) => byId.get(id)).filter(Boolean) as AISuggestion[];
  }, [overview, remaining, carousel]);

  const cycle = () =>
    setCarousel((prev) => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });

  const filtered = useMemo(() => {
    const list = remaining;
    return list.filter((s) => {
      if (filterCategory !== "All" && s.category !== filterCategory) return false;
      if (filterUrgency !== "All" && s.urgency !== filterUrgency) return false;
      if (filterImpact !== "All" && s.impact !== filterImpact) return false;
      return true;
    });
  }, [remaining, filterCategory, filterUrgency, filterImpact]);

  const applySuggestion = (s: AISuggestion) => {
    addToBoard({ title: s.title, meta: `${s.category} • AI` });
    setSponsor(true);
    setDismissed((prev) => ({ ...prev, [s.id]: true }));
  };

  const Strong = StrongText ?? Text;

  const Root: React.ComponentType<{ children: React.ReactNode }> =
    Wrap ?? (({ children }: { children: React.ReactNode }) => <>{children}</>);

  if (!overview) return <Text>Loading…</Text>;
  if (!remaining.length) return <Text>All caught up.</Text>;

  const Filters = Row && Button ? (
    <>
      <Text>Filter: Category, urgency, impact</Text>
      <Row>
        <Button
          title={filterCategory === "All" ? "Category: All" : `Category: ${filterCategory}`}
          variant="ghost"
          onPress={() => {
            const next: Array<"All" | AISuggestion["category"]> = ["All", "Finance", "Clients", "Workflow"];
            const i = next.indexOf(filterCategory);
            setFilterCategory(next[(i + 1) % next.length]);
          }}
        />
        <Button
          title={filterUrgency === "All" ? "Urgency: All" : `Urgency: ${filterUrgency}`}
          variant="ghost"
          onPress={() => {
            const next: Array<"All" | AISuggestion["urgency"]> = ["All", "Low", "Medium", "High"];
            const i = next.indexOf(filterUrgency);
            setFilterUrgency(next[(i + 1) % next.length]);
          }}
        />
        <Button
          title={filterImpact === "All" ? "Impact: All" : `Impact: ${filterImpact}`}
          variant="ghost"
          onPress={() => {
            const next: Array<"All" | AISuggestion["impact"]> = ["All", "Low", "Medium", "High"];
            const i = next.indexOf(filterImpact);
            setFilterImpact(next[(i + 1) % next.length]);
          }}
        />
      </Row>
    </>
  ) : (
    <Text>Filter: {filterCategory} • {filterUrgency} • {filterImpact}</Text>
  );

  const Feed = Wrap && Section ? (
    <Wrap>
      {filtered.map((s) => (
        <Section key={s.id} title={`${s.category} • ${s.urgency} • ${s.impact}`}>
          <Text>{s.title}</Text>
          <Text>{s.detail}</Text>
          {Button ? <Button title="Add to board" variant="primary" onPress={() => applySuggestion(s)} /> : null}
          <Text>Why this?</Text>
          <Text>{s.why}</Text>
        </Section>
      ))}
    </Wrap>
  ) : (
    <>
      {filtered.map((s) => (
        <Text key={s.id}>
          • {s.category}: {s.title}
        </Text>
      ))}
    </>
  );

  const Full = (
    <>
      {sponsor ? <Text>Zapier automation added</Text> : null}
      {Filters}
      {Feed}
    </>
  );

  return (
    <Root>
      {Tap && FullScreen ? (
        <Tap
          onPress={() => {
            setSponsor(false);
            setOpen(true);
          }}
        >
          <Strong>AI suggestions</Strong>
        </Tap>
      ) : (
        <Strong>AI suggestions</Strong>
      )}

      {CardStack ? (
        <CardStack cards={carouselCards.length ? carouselCards : remaining.slice(0, 3)} onDo={() => cycle()} onDismiss={() => cycle()} />
      ) : (
        <>
          {Tap ? (
            <Tap onPress={() => cycle()}>
              <Text>
                • {remaining[0].category}: {remaining[0].title}
              </Text>
            </Tap>
          ) : (
            <Text>
              • {remaining[0].category}: {remaining[0].title}
            </Text>
          )}
        </>
      )}

      {FullScreen ? (
        <FullScreen
          open={open}
          onClose={() => {
            setOpen(false);
            setSponsor(false);
          }}
          title="AI Suggestions"
        >
          {Full}
        </FullScreen>
      ) : null}
    </Root>
  );
}
