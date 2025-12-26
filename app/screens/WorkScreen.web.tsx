import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Button, Card, ChartPlaceholder, Col, H1, H2, Muted, Row, Tabs, TablePlaceholder } from "@ui/web";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { addMonths, formatMonthYear, getMonthGrid, getWeekdayLabels } from "@app/utils/calendar";
import { formatShortDate } from "@app/utils/date";

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

const DayCell = styled.div<{ $isToday?: boolean; $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: ${({ $selected }) => ($selected ? 2 : 1)}px solid
    ${({ theme, $selected, $isToday }) =>
      $selected ? theme.colors.primary : $isToday ? theme.colors.primary : theme.colors.border};
  text-align: center;
  cursor: pointer;
  user-select: none;
  background: ${({ theme, $selected, $isToday }) =>
    $selected ? theme.colors.surface : $isToday ? theme.colors.primary : "transparent"};
`;

const DayText = styled.div<{ $muted?: boolean }>`
  color: ${({ theme, $muted }) => ($muted ? theme.colors.mutedText : theme.colors.text)};
`;

const CalendarNavRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const CalendarNavSide = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const CalendarNavCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const FormWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const FieldLabel = styled.div`
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export function WorkScreen() {
  const refresh = useWorkStore((s) => s.refresh);
  const summary = useWorkStore((s) => s.summary);
  const [tab, setTab] = useState("projects");
  const [month, setMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [apptTitle, setApptTitle] = useState("Work appointment");
  const [apptStart, setApptStart] = useState("09:00");
  const [apptEnd, setApptEnd] = useState("10:00");
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!showAppointmentForm) return;

    const onDown = (ev: MouseEvent) => {
      const root = calendarRef.current;
      if (!root) return;
      const target = ev.target as Node | null;
      if (target && root.contains(target)) return;
      setShowAppointmentForm(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showAppointmentForm]);

  const weekdayLabels = useMemo(() => getWeekdayLabels(0), []);
  const monthGrid = useMemo(() => getMonthGrid(month, 0), [month]);

  const workTabs = useMemo(
    () => [
      { key: "projects", label: "Projects (Kanban)", badge: summary ? summary.activeProjects : null },
      { key: "tasks", label: "Tasks", badge: summary ? summary.openTasks : null },
      { key: "calendar", label: "Calendar" },
      { key: "forecast", label: "Cash Flow Forecast" },
    ],
    [summary]
  );

  const parseTimeOnDate = (date: Date, time: string) => {
    const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, 0);
  };

  const openGoogleCalendarTemplate = (input: { date: Date; title: string; start: Date; end: Date }) => {
    const { date, title, start, end } = input;
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dates = `${fmt(start)}/${fmt(end)}`;

    const url =
      "https://calendar.google.com/calendar/render" +
      `?action=TEMPLATE&text=${encodeURIComponent(title)}` +
      `&dates=${encodeURIComponent(dates)}` +
      `&details=${encodeURIComponent(`Created from BreadBoard on ${formatShortDate(date)}`)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const downloadAppleIcs = (input: { date: Date; title: string; start: Date; end: Date }) => {
    const { date, title, start, end } = input;
    const dt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const uid = `breadboard-${start.getTime()}@breadboard`;
    const now = dt(new Date());

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BreadBoard//Work Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dt(start)}`,
      `DTEND:${dt(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${`Created from BreadBoard on ${formatShortDate(date)}`}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breadboard-appointment-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Col style={{ gap: 16 }}>
      <H1>Work</H1>

      <Tabs items={workTabs} activeKey={tab} onChange={setTab} />

      {tab === "projects" && (
        <Card>
          <Muted>Kanban placeholder</Muted>
          <TablePlaceholder title="Kanban columns/cards" />
        </Card>
      )}
      {tab === "tasks" && <TablePlaceholder title="Task list" />}
      {tab === "calendar" && (
        <Card ref={calendarRef}>
          <CalendarNavRow>
            <CalendarNavSide>
              <Button variant="ghost" onClick={() => setMonth(addMonths(month, -1))}>‹</Button>
            </CalendarNavSide>

            <CalendarNavCenter>
              <H2>{formatMonthYear(month)}</H2>
            </CalendarNavCenter>

            <CalendarNavSide>
              <Button
                variant="ghost"
                onClick={() => {
                  if (!selectedDay) {
                    window.alert("Tap a day first to add an appointment.");
                    return;
                  }
                  setShowAppointmentForm((v) => !v);
                }}
              >
                +
              </Button>
              <Button variant="ghost" onClick={() => setMonth(addMonths(month, 1))}>›</Button>
            </CalendarNavSide>
          </CalendarNavRow>

          <WeekRow>
            {weekdayLabels.map((w) => (
              <Weekday key={w}>{w}</Weekday>
            ))}
          </WeekRow>

          <Grid>
            {monthGrid.map((d) => (
              <DayCell
                key={d.date.toISOString()}
                $isToday={d.isToday}
                $selected={selectedDay ? d.date.toDateString() === selectedDay.toDateString() : false}
                onClick={() => {
                  setSelectedDay(d.date);
                  setShowAppointmentForm(false);
                }}
              >
                <DayText
                  $muted={!d.inMonth}
                  style={{ color: d.isToday ? "#fff" : undefined }}
                >
                  {d.date.getDate()}
                </DayText>
              </DayCell>
            ))}
          </Grid>

          {selectedDay && showAppointmentForm && (
            <FormWrap>
              <H2 style={{ fontSize: 14 }}>{formatShortDate(selectedDay)}</H2>

              <FieldLabel>Title</FieldLabel>
              <Input value={apptTitle} onChange={(e) => setApptTitle(e.target.value)} />

              <TwoCol>
                <div>
                  <FieldLabel>Start</FieldLabel>
                  <Input type="time" value={apptStart} onChange={(e) => setApptStart(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>End</FieldLabel>
                  <Input type="time" value={apptEnd} onChange={(e) => setApptEnd(e.target.value)} />
                </div>
              </TwoCol>

              <Row style={{ justifyContent: "flex-end" }}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const start = parseTimeOnDate(selectedDay, apptStart);
                    const end = parseTimeOnDate(selectedDay, apptEnd);
                    if (!start || !end || end.getTime() <= start.getTime()) {
                      window.alert("Use HH:MM (24h) and ensure end is after start.");
                      return;
                    }
                    downloadAppleIcs({ date: selectedDay, title: apptTitle.trim() || "Work appointment", start, end });
                  }}
                >
                  Apple
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const start = parseTimeOnDate(selectedDay, apptStart);
                    const end = parseTimeOnDate(selectedDay, apptEnd);
                    if (!start || !end || end.getTime() <= start.getTime()) {
                      window.alert("Use HH:MM (24h) and ensure end is after start.");
                      return;
                    }
                    openGoogleCalendarTemplate({ date: selectedDay, title: apptTitle.trim() || "Work appointment", start, end });
                  }}
                >
                  Google
                </Button>
              </Row>
            </FormWrap>
          )}
        </Card>
      )}
      {tab === "forecast" && <ChartPlaceholder title="Cash flow forecast" />}
    </Col>
  );
}
