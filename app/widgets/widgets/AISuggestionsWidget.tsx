import React, { useEffect, useMemo, useState } from "react";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";
import type { AISuggestion } from "@app/context/stores/useInsightsStore";

export function AISuggestionsWidget({
  Text,
  StrongText,
  CardStack,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  CardStack?: React.ComponentType<{
    cards: AISuggestion[];
    onDo: (id: string) => void;
    onDismiss: (id: string) => void;
  }>;
}) {
  const refresh = useInsightsStore((s) => s.refresh);
  const overview = useInsightsStore((s) => s.overview);

  const [dismissed, setDismissed] = useState<Record<string, true>>({});

  useEffect(() => {
    if (!overview) refresh();
  }, [overview, refresh]);

  const remaining = useMemo(() => {
    const list = overview?.aiSuggestions ?? [];
    return list.filter((s) => !dismissed[s.id]);
  }, [overview, dismissed]);

  const onDismiss = (id: string) => setDismissed((prev) => ({ ...prev, [id]: true }));
  const onDo = (id: string) => setDismissed((prev) => ({ ...prev, [id]: true }));

  const Strong = StrongText ?? Text;

  if (!overview) return <Text>Loading…</Text>;
  if (!remaining.length) return <Text>All caught up.</Text>;

  return (
    <>
      <Strong>Top suggestions</Strong>
      {CardStack ? (
        <CardStack cards={remaining} onDo={onDo} onDismiss={onDismiss} />
      ) : (
        remaining.slice(0, 3).map((s) => (
          <Text key={s.id}>
            • {s.category}: {s.title}
          </Text>
        ))
      )}
    </>
  );
}
