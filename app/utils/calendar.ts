export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addMonths(date: Date, deltaMonths: number) {
  return new Date(date.getFullYear(), date.getMonth() + deltaMonths, 1);
}

export function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getWeekdayLabels(weekStartsOn: 0 | 1 = 0) {
  const base = new Date(2021, 7, 1); // Sunday
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
  });

  if (weekStartsOn === 1) {
    return [...labels.slice(1), labels[0]];
  }

  return labels;
}

export function getMonthGrid(activeMonth: Date, weekStartsOn: 0 | 1 = 0): CalendarDay[] {
  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay(); // 0..6
  const offset = (firstDow - weekStartsOn + 7) % 7;

  const gridStart = new Date(year, month, 1 - offset);

  const today = startOfDay(new Date());

  return Array.from({ length: 42 }, (_, idx) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + idx);
    const inMonth = date.getMonth() === month;
    const isToday = startOfDay(date).getTime() === today.getTime();

    return { date, inMonth, isToday };
  });
}
