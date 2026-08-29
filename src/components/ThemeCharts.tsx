import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell,
} from "recharts";
import { fmt } from "../lib/format";
import type { Dataset } from "../lib/types";

type Item = Dataset["modiPage"]["themes"][number]["items"][number];

/** Actual against counterfactual, 2004 onward. */
export function ThemeLine({ item }: { item: Item }) {
  const hasR = item.series.some((p) => p.r !== null);
  return (
    <div style={{ height: 190 }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={item.series} margin={{ top: 6, right: 6, bottom: 0, left: -14 }}>
          <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={{ stroke: "#E4E0D8" }} minTickGap={26} />
          <YAxis tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={false} width={52}
                 tickFormatter={(v) => fmt(v, item.unit)} />
          <Tooltip content={({ active, payload, label }: any) =>
            active && payload?.length ? (
              <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card">
                <div className="eyebrow mb-1">{label}</div>
                {payload.filter((p: any) => p.value != null).map((p: any) => (
                  <div key={p.dataKey} className="flex items-center gap-3 font-ui text-xs">
                    <span className="text-muted">{p.dataKey === "a" ? "Modi's India" : "Rahul's India"}</span>
                    <span className="num ml-auto">{fmt(p.value, item.unit)}</span>
                  </div>
                ))}
              </div>
            ) : null} />
          <ReferenceLine x={2014} stroke="#1A1A18" strokeDasharray="4 4" strokeOpacity={0.4} />
          {hasR && <Line type="monotone" dataKey="r" stroke="#1D5FA8" strokeWidth={1.8}
                         strokeDasharray="5 4" dot={false} isAnimationActive={false} connectNulls />}
          <Line type="monotone" dataKey="a" stroke="#D2691E" strokeWidth={2.4}
                dot={false} isAnimationActive={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Snapshot indicators: the four observed years as bars. */
export function ThemeBars({ item }: { item: Item }) {
  const rows = (item.obs ?? []).filter((o) => o.v !== null);
  return (
    <div style={{ height: 190 }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 6, right: 6, bottom: 0, left: -14 }}>
          <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
          <YAxis tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                 tickLine={false} axisLine={false} width={52}
                 tickFormatter={(v) => fmt(v, item.unit)} />
          <Tooltip cursor={{ fill: "#E4E0D8", fillOpacity: 0.4 }}
            content={({ active, payload, label }: any) =>
              active && payload?.length ? (
                <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card">
                  <div className="eyebrow mb-1">{label}</div>
                  <div className="num text-sm">{fmt(payload[0].value, item.unit)}</div>
                </div>
              ) : null} />
          <Bar dataKey="v" radius={[3, 3, 0, 0]}>
            {rows.map((o) => (
              <Cell key={o.year} fill={o.year >= 2024 ? "#D2691E" : "#B8B2A6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Theme summary as a heat strip — one cell per indicator, shaded by size of gain. */
export function ThemeHeat({ items }: { items: Item[] }) {
  const mx = Math.max(...items.map((i) => Math.abs(i.gap)));
  return (
    <ul className="grid gap-2 sm:grid-cols-5">
      {items.map((i) => {
        const o = 0.18 + 0.72 * (Math.abs(i.gap) / mx);
        return (
          <li key={i.id} className="rounded-md p-3" style={{ background: `rgba(210,105,30,${o})` }}>
            <p className="num text-lg text-ink">{Math.abs(i.gap).toFixed(0)}%</p>
            <p className="mt-0.5 font-ui text-[10px] leading-tight text-ink/75">
              {i.lower ? "lower" : "higher"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
