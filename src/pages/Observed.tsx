import { Link } from "react-router-dom";
import type { Untestable } from "../lib/types";
import { untestable } from "../lib/data";
import { fmt, pct } from "../lib/format";
import { Verdict, BASIS_LABEL } from "../components/Verdict";
import { PeerChart } from "../components/PeerChart";
import { ExplainObserved } from "../components/Explain";
import { data } from "../lib/data";

const STATUS: Record<string, string> = {
  exact: "Comparable observation for the requested year",
  nearest: "Nearest published observation used",
  latest_available: "Requested year not yet published; latest observation repeated",
  derived: "Calculated from published components",
  projected: "Official or modelled projection",
  legacy_proxy: "Older data under a somewhat different definition",
  administrative_status: "Administrative or programme reporting, not a survey measure",
  administrative_ratio: "Administrative coverage ratio; can exceed 100%",
  not_applicable: "Indicator or system did not yet exist",
  unavailable: "No sufficiently comparable observation located",
};

export default function Observed({ item }: { item: Untestable }) {
  const idx = untestable.findIndex((u) => u.id === item.id);
  const prev = untestable[idx - 1], next = untestable[idx + 1];
  const pts = item.observed.filter((o) => o.value !== null);
  const vals = pts.map((p) => p.value as number);
  const lo = Math.min(...vals, 0), hi = Math.max(...vals, 1);
  const norm = (v: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
  const c = item.observedChange;

  return (
    <article className="mx-auto max-w-7xl px-6 py-14">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 transition-colors
                              duration-300 hover:text-rahulInk">← All indicators</Link>

      <header className="mt-6 border-b border-border pb-10">
        <p className="eyebrow mb-4">{item.category} · indicator {item.id}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="max-w-[22ch] font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {item.title}
          </h1>
          <Verdict side={item.verdictSide} size="lg" />
        </div>
        <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
          {item.basis === "peers"
            ? `Comparable data exists for ${item.peers?.n} countries but begins in ` +
              `${item.peers?.years[0]}, leaving too few pre-2014 years to fit a synthetic ` +
              `counterfactual. India is placed against those peers directly instead.`
            // Most of these have no cross-country series at all. Some do, and it is the
            // series itself that cannot carry a counterfactual — an interpolated trend,
            // say. Where the record explains which, it is more use than the default.
            : item.reason && item.reason.length > 60
            ? `${item.reason} The verdict here compares observed Indian figures over time — ` +
              "a weaker basis than the estimated indicators."
            : "No comparable cross-country series exists for this measure, so no synthetic " +
              "counterfactual can be estimated. The verdict here compares observed Indian " +
              "figures over time — a weaker basis than the estimated indicators."}
        </p>
        {c && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              [String(c.baseYear), fmt(c.base), "text-ink", "baseline"],
              [String(c.latestYear), fmt(c.latest), "text-modiInk", "latest observed"],
              ["Change", c.fromZero ? "new" : pct(c.changePct as number),
                item.verdictSide === "modi" ? "text-modiInk" : "text-rahulInk",
                item.basis === "peers" ? `rank ${item.peers?.rank} of ${item.peers?.n} peers`
                  : BASIS_LABEL.observed],
            ].map(([k, v, cls, sub]) => (
              <div key={k} className="border-t border-border pt-4">
                <p className="eyebrow">{k}</p>
                <p className={`num mt-1 text-3xl ${cls}`}>{v}</p>
                <p className="mt-1 font-ui text-[11px] text-muted">{sub}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {item.peers && (
        <section className="border-b border-border py-14">
          <h2 className="font-display text-2xl">India against reporting peers</h2>
          <p className="mb-8 mt-1 max-w-reading font-ui text-xs text-muted">
            {item.peers.unit} · {item.sourceFamily}. India in orange; the other
            {" "}{item.peers.n - 1} countries that report on a comparable basis in grey.
            Growth multiple {item.peers.years[1]}–{item.peers.years[item.peers.years.length - 1]}.
          </p>
          <PeerChart peers={item.peers} />
        </section>
      )}

      <ExplainObserved item={item} />

      {item.annual && item.annual.length > 4 && (
        <section className="border-b border-border py-14">
          <h2 className="font-display text-2xl">Year by year</h2>
          <p className="mb-8 mt-1 max-w-reading font-ui text-xs text-muted">
            {item.unit} · annual series, {item.annual[0].year}–{item.annual[item.annual.length - 1].year}.
            Bars from 2014 in orange. No counterfactual is estimated — no comparator country
            reports an equivalent series.
          </p>
          {(() => {
            const vals = item.annual.filter((a) => a.value !== null).map((a) => a.value as number);
            const mx = Math.max(...vals, 1);
            return (
              <ul className="flex h-[220px] items-end gap-1" aria-hidden="true">
                {item.annual.map((a) => (
                  <li key={a.year} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <span className="num text-[9px] text-muted">{a.value ?? ""}</span>
                    <div className={`w-full rounded-t-sm ${a.year >= 2014 ? "bg-modi/55" : "bg-muted/30"}`}
                         style={{ height: a.value === null ? 2 : `${4 + (a.value / mx) * 150}px` }} />
                    <span className="num text-[8px] text-muted">{String(a.year).slice(2)}</span>
                  </li>
                ))}
              </ul>
            );
          })()}
        </section>
      )}

      <section className="grid gap-14 py-14 lg:grid-cols-12">
        <figure className="min-w-0 lg:col-span-7">
          <h2 className="font-display text-2xl">Decade totals</h2>
          <p className="mb-8 mt-1 font-ui text-xs text-muted">
            {item.unit}{item.sourceFamily ? ` · ${item.sourceFamily}` : ""}
          </p>
          <ul className="flex h-[260px] items-end gap-6" aria-hidden="true">
            {item.observed.map((o) => (
              <li key={o.year} className="flex flex-1 flex-col items-center justify-end gap-2">
                <span className="num text-sm text-ink">{fmt(o.value)}</span>
                <div className={`w-full rounded-t-sm ${o.year >= 2024 ? "bg-modi/50" : "bg-muted/25"}`}
                     style={{ height: o.value === null ? 3 : `${12 + norm(o.value) * 168}px` }} />
                <span className="num text-xs text-muted">{o.year}</span>
              </li>
            ))}
          </ul>
        </figure>

        <div className="min-w-0 lg:col-span-5">
          <h2 className="font-display text-2xl">Why no counterfactual</h2>
          <p className="mt-3 max-w-reading font-ui text-sm leading-relaxed text-muted">{item.reason}</p>

          <h3 className="mt-10 font-display text-lg">Observation quality</h3>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {item.observed.map((o) => (
              <div key={o.year} className="py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="num text-sm">{o.year}</dt>
                  <dd className="num text-sm">{fmt(o.value)}</dd>
                </div>
                <p className="mt-1 font-ui text-[11px] leading-relaxed text-muted">
                  {STATUS[o.status] ?? o.status}{o.period ? ` · ${o.period}` : ""}
                </p>
              </div>
            ))}
          </dl>
          {item.indicatorNote && (
            <p className="mt-6 rounded-md border-l-2 border-border bg-border/15 px-4 py-3
                          font-ui text-xs leading-relaxed text-muted">{item.indicatorNote}</p>
          )}
        </div>
      </section>

      <nav className="flex items-stretch justify-between gap-4 border-t border-border pt-8">
        {prev ? (
          <Link to={`/indicator/${prev.id}`}
            className="group flex-1 rounded-lg border border-border p-4 transition-all duration-300
                       hover:border-muted/50 hover:bg-border/10">
            <p className="eyebrow">← Previous</p>
            <p className="mt-1 font-display text-base">{prev.title}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link to={`/indicator/${next.id}`}
            className="group flex-1 rounded-lg border border-border p-4 text-right transition-all
                       duration-300 hover:border-muted/50 hover:bg-border/10">
            <p className="eyebrow">Next →</p>
            <p className="mt-1 font-display text-base">{next.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </nav>

      <p className="mt-12 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
        {data.meta.caveat}
      </p>
    </article>
  );
}
