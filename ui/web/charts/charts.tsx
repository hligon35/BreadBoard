import React, { useMemo } from "react";
import { useTheme } from "styled-components";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function extent(values: number[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 1 };
  if (min === max) return { min: min - 1, max: max + 1 };
  return { min, max };
}

export function SparkLine({
  values,
  height = 72,
  stroke,
  strokeWidth = 2,
}: {
  values: number[];
  height?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const theme = useTheme() as any;
  const color = stroke ?? theme.colors.primary;

  const d = useMemo(() => {
    if (!values.length) return "";
    const w = 240;
    const h = height;
    const pad = 4;
    const { min, max } = extent(values);

    const xFor = (i: number) => (values.length === 1 ? w / 2 : (i / (values.length - 1)) * (w - pad * 2) + pad);
    const yFor = (v: number) => {
      const t = (v - min) / (max - min);
      return (1 - t) * (h - pad * 2) + pad;
    };

    let path = `M ${xFor(0).toFixed(2)} ${yFor(values[0]).toFixed(2)}`;
    for (let i = 1; i < values.length; i++) {
      path += ` L ${xFor(i).toFixed(2)} ${yFor(values[i]).toFixed(2)}`;
    }
    return path;
  }, [values, height]);

  return (
    <svg viewBox={`0 0 240 ${height}`} width="100%" height={height} role="img" aria-label="chart">
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function BarChart({
  values,
  height = 84,
  color,
}: {
  values: number[];
  height?: number;
  color?: string;
}) {
  const theme = useTheme() as any;
  const fill = color ?? theme.colors.primary;
  const border = theme.colors.border as string;

  const bars = useMemo(() => {
    const w = 240;
    const h = height;
    const pad = 6;
    const n = Math.max(1, values.length);
    const gap = 6;
    const barW = Math.max(2, (w - pad * 2 - gap * (n - 1)) / n);
    const max = Math.max(1, ...values.map((v) => Math.max(0, v)));

    return values.map((v, i) => {
      const t = Math.max(0, v) / max;
      const bh = t * (h - pad * 2);
      const x = pad + i * (barW + gap);
      const y = h - pad - bh;
      return { x, y, w: barW, h: bh };
    });
  }, [values, height]);

  return (
    <svg viewBox={`0 0 240 ${height}`} width="100%" height={height} role="img" aria-label="chart">
      <rect x={0} y={0} width={240} height={height} fill="none" stroke={border} strokeWidth={0} />
      {bars.map((b, idx) => (
        <rect key={idx} x={b.x} y={b.y} width={b.w} height={b.h} fill={fill} rx={3} />
      ))}
    </svg>
  );
}

export function StackedBars({
  seriesA,
  seriesB,
  height = 96,
  colorA,
  colorB,
}: {
  seriesA: number[];
  seriesB: number[];
  height?: number;
  colorA?: string;
  colorB?: string;
}) {
  const theme = useTheme() as any;
  const a = colorA ?? theme.colors.success;
  const b = colorB ?? theme.colors.warning;
  const border = theme.colors.border as string;

  const bars = useMemo(() => {
    const n = Math.max(seriesA.length, seriesB.length);
    const w = 240;
    const h = height;
    const pad = 6;
    const gap = 6;
    const barW = Math.max(2, (w - pad * 2 - gap * (n - 1)) / Math.max(1, n));

    const totals = Array.from({ length: n }).map((_, i) => (seriesA[i] ?? 0) + (seriesB[i] ?? 0));
    const max = Math.max(1, ...totals.map((v) => Math.max(0, v)));

    return Array.from({ length: n }).map((_, i) => {
      const va = Math.max(0, seriesA[i] ?? 0);
      const vb = Math.max(0, seriesB[i] ?? 0);
      const ha = (va / max) * (h - pad * 2);
      const hb = (vb / max) * (h - pad * 2);
      const x = pad + i * (barW + gap);
      const yB = h - pad - hb;
      const yA = yB - ha;
      return { x, barW, ha, hb, yA, yB };
    });
  }, [seriesA, seriesB, height]);

  return (
    <svg viewBox={`0 0 240 ${height}`} width="100%" height={height} role="img" aria-label="chart">
      <rect x={0} y={0} width={240} height={height} fill="none" stroke={border} strokeWidth={0} />
      {bars.map((p, idx) => (
        <g key={idx}>
          <rect x={p.x} y={p.yB} width={p.barW} height={p.hb} fill={b} rx={3} />
          <rect x={p.x} y={p.yA} width={p.barW} height={p.ha} fill={a} rx={3} />
        </g>
      ))}
    </svg>
  );
}

export function Donut({
  value,
  total,
  size = 96,
  strokeWidth = 10,
  color,
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const theme = useTheme() as any;
  const stroke = color ?? theme.colors.primary;
  const track = theme.colors.border as string;

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const p = total > 0 ? clamp01(value / total) : 0;
  const dash = c * p;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="chart">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
