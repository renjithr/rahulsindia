import { Link } from "react-router-dom";
import type { Untestable } from "../lib/types";
import { fmt, pct } from "../lib/format";
import { Verdict } from "./Verdict";

/** Indicators with no cross-country panel: observed India figures only, no counterfactual. */
export function ObservedCard({ item }: { item: Untestable }) {
  const pts = item.observed.filter((o) => o.value !== null);
  const vals = pts.map((p) => p.value as number);
  const lo = Math.min(...vals, 0), hi = Math.max(...vals, 1);
  const norm = (v: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
  const c = item.observedChange;

  return (
    <Link
      to={`/indicator/${item.id}`}
      className="group flex h-full flex-col rounded-lg border border-dashed border-border
                 bg-surface/60 p-5 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-muted/50 hover:bg-surface hover:shadow-card"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="eyebrow">{item.category.split(",")[0]}</span>
        <Verdict side={item.verdictSide} showWhy={
          c ? `${c.base} (${c.baseYear}) → ${c.latest} (${c.latestYear})` : "No comparable observation"} />
      </div>

      {item.set === "development" && (
        <span className="mb-2 inline-block font-ui text-[10px] uppercase tracking-[0.14em] text-muted">
          out-of-sample
        </span>
      )}
      <h3 className="font-display text-lg leading-snug text-ink transition-colors duration-300
                     group-hover:text-muted">
        {item.title}
      </h3>

      {/* observed India figures — no synthetic path exists for these */}
      <ul className="mt-4 flex h-[74px] items-end gap-2" aria-hidden="true">
        {item.observed.map((o) => (
          <li key={o.year} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className={`w-full rounded-sm ${o.year >= 2024 ? "bg-modi/45" : "bg-muted/25"}`}
              style={{ height: o.value === null ? 2 : `${8 + norm(o.value) * 52}px` }}
            />
            <span className="num text-[9px] text-muted">{String(o.year).slice(2)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t border-border pt-3">
        <div>
          <dt className="eyebrow">{c ? c.baseYear : "2014"}</dt>
          <dd className="num text-sm text-ink">{fmt(c?.base)}</dd>
        </div>
        <div>
          <dt className="eyebrow">{c ? c.latestYear : "2024"}</dt>
          <dd className="num text-sm text-modiInk">{fmt(c?.latest)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className={`num text-2xl ${
          item.verdictSide === "modi" ? "text-modiInk"
          : item.verdictSide === "rahul" ? "text-rahulInk" : "text-muted"}`}>
          {c ? (c.fromZero ? "new" : pct(c.changePct as number)) : "—"}
        </span>
        <span className="font-ui text-[11px] text-muted">
          {item.basis === "peers" && item.peers
            ? `rank ${item.peers.rank}/${item.peers.n} of peers`
            : "observed change"}
        </span>
      </div>

      {/* The reason lives on the detail page. Card heights are equalised across
          the rail, so one long note here stretched every card beside it. */}
      <span className="mt-3 font-ui text-[11px] text-muted">
        {item.basis === "peers" ? "Peer comparison" : "No counterfactual"}
      </span>
    </Link>
  );
}
