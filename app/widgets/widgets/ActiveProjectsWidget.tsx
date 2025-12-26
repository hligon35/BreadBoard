import React, { useEffect, useMemo, useState } from "react";
import { useWorkStore } from "@app/context/stores/useWorkStore";

type ButtonLike = React.ComponentType<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
}>;

type RowLike = React.ComponentType<{ children: React.ReactNode }>;

type TapLike = React.ComponentType<{ onPress: () => void; children: React.ReactNode }>;

type FullScreenLike = React.ComponentType<{ open: boolean; onClose: () => void; children: React.ReactNode; title?: string }>;

export function ActiveProjectsWidget({
  Text,
  StrongText,
  Kanban,
  KanbanBoard,
  Gantt,
  Row,
  Button,
  Tap,
  FullScreen,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
  StrongText?: React.ComponentType<{ children: React.ReactNode }>;
  Kanban?: React.ComponentType<{
    columns: Array<{
      key: "todo" | "doing" | "done";
      title: string;
      count: number;
      cards: Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>;
    }>;
  }>;
  KanbanBoard?: React.ComponentType<{
    columns: Array<{
      key: "todo" | "doing" | "done";
      title: string;
      cards: Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>;
    }>;
    onMoveCard?: (cardId: string, toColumnKey: "todo" | "doing" | "done") => void;
  }>;
  Gantt?: React.ComponentType<{
    items: Array<{
      id: string;
      title: string;
      meta?: string;
      status: "todo" | "doing" | "done";
      deadline?: string;
      progress?: number;
      avatar?: string;
    }>;
  }>;
  Row?: RowLike;
  Button?: ButtonLike;
  Tap?: TapLike;
  FullScreen?: FullScreenLike;
}) {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const board = useWorkStore((s) => s.board);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"board" | "timeline">("board");
  const [localColumns, setLocalColumns] = useState<
    Array<{
      key: "todo" | "doing" | "done";
      title: string;
      cards: Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>;
    }>
  >([]);

  useEffect(() => {
    if (!summary || !board) refresh();
  }, [summary, board, refresh]);

  useEffect(() => {
    if (!board) return;
    setLocalColumns(board.columns.map((c) => ({ key: c.key, title: c.title, cards: c.cards })));
  }, [board]);

  // IMPORTANT: keep hooks stable even while loading (Fast Refresh / initial async load).
  const boardColumns = board?.columns ?? [];
  const columns = boardColumns.map((c) => ({
    key: c.key,
    title: c.title,
    count: c.cards.length,
    cards: c.cards,
  }));

  const fullColumns = localColumns.length
    ? localColumns
    : boardColumns.map((c) => ({ key: c.key, title: c.title, cards: c.cards }));

  const items = useMemo(() => {
    return fullColumns.flatMap((c) => c.cards.map((card) => ({ ...card, status: c.key })));
  }, [fullColumns]);

  const alerts = useMemo(() => {
    const today = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const isBehind = (it: { title: string; status: "todo" | "doing" | "done"; deadline?: string; progress?: number }) => {
      if (it.status === "done") return false;
      if (!it.deadline) return false;
      const d = new Date(it.deadline);
      const days = Math.floor((d.getTime() - today.getTime()) / dayMs);
      const p = typeof it.progress === "number" ? it.progress : 0;
      return days <= 2 && p < 0.6;
    };
    return items.filter(isBehind).slice(0, 2).map((it) => `Project ${it.title} is behind`);
  }, [items]);

  if (!summary || !board) return <Text>Loading…</Text>;

  const Strong = StrongText ?? Text;

  const onMoveCard = (cardId: string, toColumnKey: "todo" | "doing" | "done") => {
    setLocalColumns((prev) => {
      const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
      let moving:
        | { id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }
        | null = null;
      for (const col of next) {
        const idx = col.cards.findIndex((c) => c.id === cardId);
        if (idx >= 0) {
          moving = col.cards[idx];
          col.cards.splice(idx, 1);
          break;
        }
      }
      if (!moving) return prev;
      const target = next.find((c) => c.key === toColumnKey);
      if (!target) return prev;
      target.cards.push(moving);
      return next;
    });
  };

  const bottleneck = columns
    .filter((c) => c.key !== "done")
    .reduce(
      (best, cur) => (cur.count > best.count ? cur : best),
      {
        key: "todo" as const,
        title: "To do",
        count: -1,
        cards: [] as Array<{ id: string; title: string; meta?: string; progress?: number; deadline?: string; avatar?: string }>,
      }
    );

  const Dashboard = (
    <>
      {bottleneck.count > 0 ? (
        <Text>
          Bottleneck: {bottleneck.title} ({bottleneck.count})
        </Text>
      ) : null}
      {Kanban ? <Kanban columns={columns} /> : null}
    </>
  );

  const Controls = Row && Button ? (
    <Row>
      <Button title="Board" variant={view === "board" ? "primary" : "ghost"} onPress={() => setView("board")} />
      <Button title="Timeline" variant={view === "timeline" ? "primary" : "ghost"} onPress={() => setView("timeline")} />
    </Row>
  ) : null;

  const Full = (
    <>
      <Text>Trello integration enabled</Text>
      {Controls}
      {alerts.length ? (
        <>
          <Strong>AI alerts</Strong>
          {alerts.map((a) => (
            <Text key={a}>{a}</Text>
          ))}
        </>
      ) : null}
      {view === "board" ? (
        KanbanBoard ? (
          <KanbanBoard columns={fullColumns} onMoveCard={onMoveCard} />
        ) : null
      ) : Gantt ? (
        <Gantt items={items} />
      ) : null}
    </>
  );

  return (
    <>
      {Tap && FullScreen ? <Tap onPress={() => setOpen(true)}>{Dashboard}</Tap> : Dashboard}
      {FullScreen ? (
        <FullScreen open={open} onClose={() => setOpen(false)} title="Active Projects">
          {Full}
        </FullScreen>
      ) : null}
    </>
  );
}
