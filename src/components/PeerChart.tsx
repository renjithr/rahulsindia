import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import type { Peers } from "../lib/types";
import { COUNTRY } from "../lib/data";
import { fmt } from "../lib/format";

const PEER = "#B8B2A6";
const MODI = "#D2691E";

/** India against comparable reporting countries. No counterfactual — real peers. */
export function PeerChart({ peers, height = 340 }: { peers: Peers; height?: number }) {
  const others = Object.keys(peers.series).filter((c) => c !== "IND");
  const rows = peers.years.map((y, i) => {
    const r: Record<string, number | null | string> = { year: y };
    for (const c of Object.keys(peers.series)) r[c] = peers.series[c][i];
    return r;
  });

  return (
    <>
      <div style={{ height }} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 56, bottom: 0, left: -6 }}>
            <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={{ stroke: "#E4E0D8" }} minTickGap={20} />
            <YAxis tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={false} width={54} tickFormatter={(v) => fmt(v)} />
            <Tooltip
              cursor={{ stroke: "#B8B2A6", strokeDasharray: "3 3" }}
              content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                const sorted = [...payload].filter((p) => p.value != null)
                  .sort((a, b) => b.value - a.value);
                return (
                  <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card">
                    <div className="eyebrow mb-1.5">{label}</div>
                    <div className="space-y-0.5 font-ui text-xs">
                      {sorted.map((p) => (
                        <div key={p.dataKey} className={`flex items-center gap-3 ${
                          p.dataKey === "IND" ? "font-semibold text-modiInk" : "text-muted"}`}>
                          <span>{COUNTRY[p.dataKey] ?? p.dataKey}</span>
                          <span className="num ml-auto">{fmt(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }} />
            <ReferenceLine x={2013} stroke="#1A1A18" strokeDasharray="4 4" strokeOpacity={0.45}
              label={{ value: "2014", position: "insideTopLeft", fontSize: 10,
                       fill: "#6B675E", fontFamily: "JetBrains Mono", dy: -2 }} />
            {others.map((c) => (
              <Line key={c} type="monotone" dataKey={c} stroke={PEER} strokeWidth={1.25}
                    dot={false} isAnimationActive={false} connectNulls />
            ))}
            <Line type="monotone" dataKey="IND" stroke={MODI} strokeWidth={2.6}
                  dot={false} isAnimationActive={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ol className="mt-6 divide-y divide-border border-y border-border">
        {Object.entries(peers.growthPc).sort((a, b) => b[1] - a[1]).map(([c, g], i) => (
          <li key={c} className={`flex items-center gap-4 py-2 ${c === "IND" ? "font-semibold" : ""}`}>
            <span className="num w-6 text-xs text-muted">{i + 1}</span>
            <span className={`flex-1 font-ui text-sm ${c === "IND" ? "text-modiInk" : "text-ink"}`}>
              {COUNTRY[c] ?? c}
            </span>
            <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-border sm:block">
              <div className={`h-full rounded-full ${c === "IND" ? "bg-modi" : "bg-muted/40"}`}
                   style={{ width: `${(g / Math.max(...Object.values(peers.growthPc))) * 100}%` }} />
            </div>
            <span className="num w-16 text-right text-sm">{g.toFixed(1)}×</span>
          </li>
        ))}
      </ol>
    </>
  );
}
