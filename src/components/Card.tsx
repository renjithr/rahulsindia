import { Link } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, ReferenceLine, YAxis } from "recharts";
import type { Indicator } from "../lib/types";
import { fmt, pct, pLabel } from "../lib/format";
import { Verdict, verdictOf } from "./Verdict";

export function Card({ item }: { item: Indicator }) {
  const side = verdictOf(item);
  const spark = item.series.filter((p) => p.actual !== null || p.synth !== null);
  return (
    <Link
      to={`/indicator/${item.id}`}
      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5
                 shadow-card transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-rahul/40 hover:shadow-[0_12px_32px_-12px_rgba(20,69,124,.24)]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="eyebrow">{item.category}</span>
        <Verdict side={side} showWhy={
          side === "none"
            ? `Pre-2014 fit ${item.fit.toFixed(1)}% — no call`
            : `${side === "modi" ? "Actual" : "Counterfactual"} is on the better side`} />
      </div>

      {item.set === "development" && (
        <span className="mb-2 inline-block font-ui text-[10px] uppercase tracking-[0.14em] text-muted">
          out-of-sample
        </span>
      )}
      <h3 className="font-display text-lg leading-snug text-ink group-hover:text-rahulInk
                     transition-colors duration-300">
        {item.title}
      </h3>

      <div className="mt-4 h-[74px]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <ReferenceLine x={2013} stroke="#1A1A18" strokeOpacity={0.28} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="synth" stroke="#1D5FA8" strokeWidth={1.5}
                  strokeDasharray="4 3" dot={false} isAnimationActive={false} connectNulls />
            <Line type="monotone" dataKey="actual" stroke="#D2691E" strokeWidth={2}
                  dot={false} isAnimationActive={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-border pt-3">
        <div>
          <dt className="eyebrow">Rahul</dt>
          <dd className="num text-sm text-rahulInk">{fmt(item.rahul, item.unit)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Modi</dt>
          <dd className="num text-sm text-modiInk">{fmt(item.modi, item.unit)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`num text-2xl ${
          side === "modi" ? "text-modiInk" : side === "rahul" ? "text-rahulInk" : "text-muted"
        }`}>
          {pct(item.gapPct)}
        </span>
        <span className="font-ui text-[11px] text-muted">
          {pLabel(item.p)}
          {item.q !== null && item.q !== undefined && (
            <span className="ml-1.5">· q = {item.q.toFixed(2)}</span>
          )}
        </span>
      </div>

      {item.tier === 2 && (
        <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
          Pre-2014 fit {item.fit.toFixed(1)}% — outside interpretable range
        </p>
      )}
    </Link>
  );
}
