import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Area, AreaChart,
} from "recharts";
import type { Point } from "../lib/types";
import { fmt } from "../lib/format";

const RAHUL = "#1D5FA8";   // blue  — synthetic
const MODI  = "#D2691E";   // orange — actual

type Props = { series: Point[]; unit?: string; height?: number; compact?: boolean };

function TipBox({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  const get = (k: string) => payload.find((p: any) => p.dataKey === k)?.value ?? null;
  return (
    <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card backdrop-blur">
      <div className="eyebrow mb-1">{label}</div>
      <div className="space-y-0.5 font-ui text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: MODI }} />
          <span className="text-muted">Modi&nbsp;India</span>
          <span className="num ml-auto">{fmt(get("actual"), unit)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: RAHUL }} />
          <span className="text-muted">Rahul&nbsp;India</span>
          <span className="num ml-auto">{fmt(get("synth"), unit)}</span>
        </div>
      </div>
    </div>
  );
}

export function Chart({ series, unit = "", height = 300, compact = false }: Props) {
  return (
    <div style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: compact ? -22 : -6 }}>
          <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={{ stroke: "#E4E0D8" }} minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={false} width={compact ? 40 : 60}
                 tickFormatter={(v) => fmt(v, unit)} />
          <Tooltip content={<TipBox unit={unit} />} cursor={{ stroke: "#B8B2A6", strokeDasharray: "3 3" }} />
          <ReferenceLine x={2013} stroke="#1A1A18" strokeDasharray="4 4" strokeOpacity={0.45}
            label={compact ? undefined : { value: "2014", position: "insideTopLeft",
              fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono", dy: -2 }} />
          <Line type="monotone" dataKey="synth" stroke={RAHUL} strokeWidth={2}
                strokeDasharray="5 4" dot={false} isAnimationActive={false} connectNulls />
          <Line type="monotone" dataKey="actual" stroke={MODI} strokeWidth={2.4}
                dot={false} isAnimationActive={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Post-2014 divergence, drawn as a filled gap band. */
export function GapChart({ series, unit = "", height = 260 }: Props) {
  const d = series
    .filter((p) => p.year >= 2010 && p.actual !== null && p.synth !== null)
    .map((p) => ({ year: p.year, gap: (p.actual as number) - (p.synth as number) }));
  return (
    <div style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 8, right: 8, bottom: 0, left: -6 }}>
          <defs>
            <linearGradient id="gapfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MODI} stopOpacity={0.28} />
              <stop offset="100%" stopColor={MODI} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={false} width={60} tickFormatter={(v) => fmt(v, unit)} />
          <Tooltip cursor={{ stroke: "#B8B2A6", strokeDasharray: "3 3" }}
            content={({ active, payload, label }: any) =>
              active && payload?.length ? (
                <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card">
                  <div className="eyebrow mb-1">{label}</div>
                  <div className="num text-sm">{fmt(payload[0].value, unit)}</div>
                </div>
              ) : null} />
          <ReferenceLine y={0} stroke="#1A1A18" strokeOpacity={0.5} />
          <ReferenceLine x={2013} stroke="#1A1A18" strokeDasharray="4 4" strokeOpacity={0.45} />
          <Area type="monotone" dataKey="gap" stroke={MODI} strokeWidth={2}
                fill="url(#gapfill)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
