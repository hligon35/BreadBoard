import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/native";

import { Button, Card, ChartPlaceholder, Container, H1, H2, Muted, Row, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { addMonths, formatMonthYear, getMonthGrid, getWeekdayLabels } from "@app/utils/calendar";

const WeekRow = styled.View`
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
`;

const Weekday = styled.Text`
  width: 14.2857%;
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DayCell = styled.View<{ $isToday?: boolean }>`
  width: 14.2857%;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid
    ${({ theme, $isToday }) => ($isToday ? theme.colors.primary : theme.colors.border)};
`;

const DayText = styled.Text<{ $muted?: boolean }>`
  text-align: center;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.mutedText : theme.colors.text)};
`;

const workTabs = [
  { key: "projects", label: "Projects" },
  { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" },
  { key: "forecast", label: "Forecast" },
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
    <Screen>
      <Scroll>
        <Container>
          <H1>Work</H1>
          <Card>
            <Muted>
              {summary
                ? `Active projects: ${summary.activeProjects} • Open tasks: ${summary.openTasks}`
                : "Loading mock data..."}
            </Muted>
          </Card>
          <Tabs items={workTabs} activeKey={tab} onChange={setTab} />
          {tab === "projects" && <TablePlaceholder title="Kanban placeholder" />}
          {tab === "tasks" && <TablePlaceholder title="Tasks placeholder" />}
          {tab === "calendar" && (
            <Card>
              <Row style={{ justifyContent: "space-between" }}>
                <Button title="Prev" variant="ghost" onPress={() => setMonth(addMonths(month, -1))} />
                <H2>{formatMonthYear(month)}</H2>
                <Button title="Next" variant="ghost" onPress={() => setMonth(addMonths(month, 1))} />
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
        </Container>
      </Scroll>
    </Screen>
  );
}
