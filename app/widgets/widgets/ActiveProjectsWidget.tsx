import React, { useEffect } from "react";
import { useWorkStore } from "@app/context/stores/useWorkStore";

export function ActiveProjectsWidget({
  Text,
  StrongText,
  Kanban,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Kanban?: React.ComponentType<{
    columns: Array<{
      key: "todo" | "doing" | "done";
      title: string;
      count: number;
      cards: Array<{ id: string; title: string; meta?: string }>;
    }>;
  }>;
}) {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const board = useWorkStore((s) => s.board);

  useEffect(() => {
    if (!summary || !board) refresh();
  }, [summary, board, refresh]);

  if (!summary || !board) return <Text>Loading…</Text>;

  const Strong = StrongText ?? Text;

  const columns = board.columns.map((c) => ({
    key: c.key,
    title: c.title,
    count: c.cards.length,
    cards: c.cards,
  }));

  const bottleneck = columns
    .filter((c) => c.key !== "done")
    .reduce(
      (best, cur) => (cur.count > best.count ? cur : best),
      { key: "todo" as const, title: "To do", count: -1, cards: [] as Array<{ id: string; title: string; meta?: string }> }
    );

  return (
    <>
      <Strong>{summary.activeProjects} active projects</Strong>
      {bottleneck.count > 0 ? <Text>Bottleneck: {bottleneck.title} ({bottleneck.count})</Text> : null}
      {Kanban ? <Kanban columns={columns} /> : null}
    </>
  );
}
