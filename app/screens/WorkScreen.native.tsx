import React, { useEffect, useMemo, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, TextInput } from "react-native";
import styled from "styled-components/native";

import { Button, Card, ChartPlaceholder, Container, H1, H2, Row, Screen, Scroll, Tabs, TablePlaceholder } from "@ui/native";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { addMonths, formatMonthYear, getMonthGrid, getWeekdayLabels } from "@app/utils/calendar";
import { formatShortDate } from "@app/utils/date";

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

const DayCell = styled.Pressable<{ $isToday?: boolean; $selected?: boolean }>`
  width: 14.2857%;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: ${({ $selected }) => ($selected ? 2 : 1)}px solid
    ${({ theme, $selected, $isToday }) =>
      $selected ? theme.colors.primary : $isToday ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $selected, $isToday }) =>
    $selected ? theme.colors.surface : $isToday ? theme.colors.primary : "transparent"};
`;

const DayText = styled.Text<{ $muted?: boolean; $isToday?: boolean }>`
  text-align: center;
  color: ${({ theme, $muted, $isToday }) =>
    $isToday ? "#fff" : $muted ? theme.colors.mutedText : theme.colors.text};
`;

const CalendarNavRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CalendarNavSide = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const CalendarNavCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const FormWrap = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const FieldLabel = styled.Text`
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Input = styled(TextInput)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
`;

const TwoCol = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Col = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

  useEffect(() => {
    refresh();
  }, [refresh]);

  const weekdayLabels = useMemo(() => getWeekdayLabels(0), []);
  const monthGrid = useMemo(() => getMonthGrid(month, 0), [month]);

  const workTabs = useMemo(
    () => [
      { key: "projects", label: "Projects", badge: summary ? summary.activeProjects : null },
      { key: "tasks", label: "Tasks", badge: summary ? summary.openTasks : null },
      { key: "calendar", label: "Calendar" },
      { key: "forecast", label: "Forecast" },
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

  const openGoogleCalendarTemplate = async (input: { date: Date; title: string; start: Date; end: Date }) => {
    const { date, title, start, end } = input;

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dates = `${fmt(start)}/${fmt(end)}`;

    const url =
      "https://calendar.google.com/calendar/render" +
      `?action=TEMPLATE&text=${encodeURIComponent(title)}` +
      `&dates=${encodeURIComponent(dates)}` +
      `&details=${encodeURIComponent(`Created from BreadBoard on ${formatShortDate(date)}`)}`;

    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      Alert.alert("Unable to open", "Google Calendar could not be opened on this device.");
      return;
    }

    await Linking.openURL(url);
  };

  const addToDeviceCalendar = async (input: { date: Date; title: string; start: Date; end: Date }) => {
    const { date, title, start, end } = input;
    let CalendarMod: any;
    try {
      CalendarMod = await import("expo-calendar");
    } catch (e) {
      Alert.alert(
        "Calendar not available",
        "This build doesn't include the Expo Calendar native module. If you're using a dev client, rebuild it after installing expo-calendar (run: npm run mobile:ios). You can still use the Google export."
      );
      return;
    }

    const perm = await CalendarMod.requestCalendarPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Calendar permission required", "Allow calendar access to add appointments.");
      return;
    }

    const calendars: any[] = await CalendarMod.getCalendarsAsync(CalendarMod.EntityTypes.EVENT);
    const target =
      calendars.find((c: any) => c?.allowsModifications) ??
      calendars.find((c: any) => c?.accessLevel === CalendarMod.CalendarAccessLevel.OWNER) ??
      calendars.find((c: any) => c?.accessLevel === CalendarMod.CalendarAccessLevel.EDITOR) ??
      calendars[0];

    if (!target) {
      Alert.alert("No calendar found", "No writable calendar is available on this device.");
      return;
    }

    await CalendarMod.createEventAsync(target.id, {
      title,
      startDate: start,
      endDate: end,
      notes: `Created from BreadBoard on ${formatShortDate(date)}`,
    });

    Alert.alert("Added", "Appointment added to your calendar.");
  };

  return (
    <Screen>
      <Scroll>
        <Container>
          <H1>Work</H1>
          <Tabs items={workTabs} activeKey={tab} onChange={setTab} />
          {tab === "projects" && <TablePlaceholder title="Kanban placeholder" />}
          {tab === "tasks" && <TablePlaceholder title="Tasks placeholder" />}
          {tab === "calendar" && (
            <Card>
              <CalendarNavRow>
                <CalendarNavSide>
                  <Button title="‹" variant="ghost" onPress={() => setMonth(addMonths(month, -1))} />
                </CalendarNavSide>

                <CalendarNavCenter>
                  <H2>{formatMonthYear(month)}</H2>
                </CalendarNavCenter>

                <CalendarNavSide>
                  <Button
                    title="+"
                    variant="ghost"
                    onPress={() =>
                      selectedDay
                        ? setShowAppointmentForm((v) => !v)
                        : Alert.alert("Select a date", "Tap a day first to add an appointment.")
                    }
                  />
                  <Button title="›" variant="ghost" onPress={() => setMonth(addMonths(month, 1))} />
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
                    onPress={() => {
                      setSelectedDay(d.date);
                      setShowAppointmentForm(false);
                    }}
                  >
                    <DayText $muted={!d.inMonth} $isToday={d.isToday}>
                      {d.date.getDate()}
                    </DayText>
                  </DayCell>
                ))}
              </Grid>

              {selectedDay && showAppointmentForm && (
                <FormWrap>
                  <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowAppointmentForm(false)} />
                  <H2 style={{ fontSize: 14 }}>{formatShortDate(selectedDay)}</H2>

                  <FieldLabel>Title</FieldLabel>
                  <Input value={apptTitle} onChangeText={setApptTitle} placeholder="Appointment title" />

                  <TwoCol>
                    <Col>
                      <FieldLabel>Start</FieldLabel>
                      <Input value={apptStart} onChangeText={setApptStart} placeholder="09:00" />
                    </Col>
                    <Col>
                      <FieldLabel>End</FieldLabel>
                      <Input value={apptEnd} onChangeText={setApptEnd} placeholder="10:00" />
                    </Col>
                  </TwoCol>

                  <Row style={{ justifyContent: "flex-end" }}>
                    <Button
                      title="Apple"
                      variant="ghost"
                      onPress={async () => {
                        const start = parseTimeOnDate(selectedDay, apptStart);
                        const end = parseTimeOnDate(selectedDay, apptEnd);
                        if (!start || !end || end.getTime() <= start.getTime()) {
                          Alert.alert("Invalid time", "Use HH:MM (24h) and ensure end is after start.");
                          return;
                        }
                        await addToDeviceCalendar({ date: selectedDay, title: apptTitle.trim() || "Work appointment", start, end });
                      }}
                    />
                    <Button
                      title="Google"
                      variant="ghost"
                      onPress={async () => {
                        const start = parseTimeOnDate(selectedDay, apptStart);
                        const end = parseTimeOnDate(selectedDay, apptEnd);
                        if (!start || !end || end.getTime() <= start.getTime()) {
                          Alert.alert("Invalid time", "Use HH:MM (24h) and ensure end is after start.");
                          return;
                        }
                        await openGoogleCalendarTemplate({ date: selectedDay, title: apptTitle.trim() || "Work appointment", start, end });
                      }}
                    />
                  </Row>
                </FormWrap>
              )}
            </Card>
          )}
          {tab === "forecast" && <ChartPlaceholder title="Cash flow forecast" />}
        </Container>
      </Scroll>
    </Screen>
  );
}
