import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { Button, Card, ChartPlaceholder, Col, H1, H2, Muted, Row, Tabs, TablePlaceholder } from "@ui/web";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { addMonths, formatMonthYear, getMonthGrid, getWeekdayLabels } from "@app/utils/calendar";

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const Weekday = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const DayCell = styled.div<{ $isToday?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid
    ${({ theme, $isToday }) => ($isToday ? theme.colors.primary : theme.colors.border)};
  text-align: center;
`;

const DayText = styled.div<{ $muted?: boolean }>`
  color: ${({ theme, $muted }) => ($muted ? theme.colors.mutedText : theme.colors.text)};
`;

const workTabs = [
  { key: "projects", label: "Projects (Kanban)" },
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "forecast", label: "Cash Flow Forecast" },
];

export function WorkScreen() {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const [tab, setTab] = useState("projects");
  const [month, setMonth] = useState(() => new Date());

  useEffect(() => {
    refresh();
  }, [refresh]);

  const weekdayLabels = useMemo(() => getWeekdayLabels(0), []);
  const monthGrid = useMemo(() => getMonthGrid(month, 0), [month]);

  return (
    <Col style={{ gap: 16 }}>
      <div>
        <H1>Work</H1>
        <Muted>
          {summary
            ? `Active projects: ${summary.activeProjects} • Open tasks: ${summary.openTasks}`
            : "Loading mock data..."}
        </Muted>
      </div>

      <Tabs items={workTabs} activeKey={tab} onChange={setTab} />

      {tab === "projects" && (
        <Card>
          <Muted>Kanban placeholder</Muted>
          <TablePlaceholder title="Kanban columns/cards" />
        </Card>
      )}
      {tab === "tasks" && <TablePlaceholder title="Task list" />}
      {tab === "calendar" && (
        <Card>
          <Row style={{ justifyContent: "space-between" }}>
            <Button variant="ghost" onClick={() => setMonth(addMonths(month, -1))}>Prev</Button>
            <H2>{formatMonthYear(month)}</H2>
            <Button variant="ghost" onClick={() => setMonth(addMonths(month, 1))}>Next</Button>
          </Row>

          <WeekRow>
            {weekdayLabels.map((w) => (
              <Weekday key={w}>{w}</Weekday>
            ))}
          </WeekRow>

          <Grid>
            {monthGrid.map((d) => (
              <DayCell key={d.date.toISOString()} $isToday={d.isToday}>
                <DayText $muted={!d.inMonth}>{d.date.getDate()}</DayText>
              </DayCell>
            ))}
          </Grid>
        </Card>
      )}
      {tab === "forecast" && <ChartPlaceholder title="Cash flow forecast" />}
    </Col>
  );
}
