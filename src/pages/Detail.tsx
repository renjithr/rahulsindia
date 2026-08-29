import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { byId, ordered, COUNTRY, data, untestableById } from "../lib/data";
import { Chart, GapChart } from "../components/Chart";
import Observed from "./Observed";
import { Method } from "../components/Method";
import { Explain } from "../components/Explain";
import { fmt, pct, pLabel } from "../lib/format";
import { Verdict, verdictOf, ChartKey } from "../components/Verdict";

export default function Detail() {
  const { id } = useParams();
  const item = byId(Number(id));
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  const obs = item ? null : untestableById(Number(id));
  if (!item) return obs ? <Observed item={obs} /> : <Navigate to="/" replace />;

  const side = verdictOf(item);
  const idx = ordered.findIndex((i) => i.id === item.id);
  const prev = ordered[idx - 1], next = ordered[idx + 1];
  const post = item.series.filter((p) => p.year >= 2014 && p.actual !== null && p.synth !== null);
  const endYear = post.length ? post[post.length - 1].year : 2024;

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
          <Verdict side={side} size="lg" showWhy={
            side === "none"
              ? `Pre-2014 fit ${item.fit.toFixed(1)}% — not interpretable`
              : `${side === "modi" ? "Actual" : "Counterfactual"} is on the better side`} />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-4">
          {[
            ["Rahul India", fmt(item.rahul, item.unit), "text-rahulInk", `synthetic ${endYear}`],
            ["Modi India", fmt(item.modi, item.unit), "text-modiInk", `actual ${endYear}`],
            ["Difference", pct(item.gapPct), side === "modi" ? "text-modiInk" : side === "rahul" ? "text-rahulInk" : "text-muted", "vs counterfactual"],
            ["Placebo rank", item.rank ?? "—", "text-ink", pLabel(item.p)],
          ].map(([k, v, cls, sub]) => (
            <div key={k as string} className="border-t border-border pt-4">
              <p className="eyebrow">{k}</p>
              <p className={`num mt-1 text-3xl ${cls}`}>{v}</p>
              <p className="mt-1 font-ui text-[11px] text-muted">{sub}</p>
            </div>
          ))}
        </div>
      </header>

      <Explain item={item} />

      <section className="grid gap-14 py-14 lg:grid-cols-12">
        <figure className="min-w-0 lg:col-span-7">
          <h2 className="font-display text-2xl">Both paths, {item.series[0].year}–{endYear}</h2>
          <p className="mb-6 mt-1 font-ui text-xs text-muted">
            Weights fitted on {item.preWindow} only; the counterfactual is projected across {item.postWindow}.
          </p>
          <Chart series={item.series} unit={item.unit} height={360} />
          <div className="mt-4"><ChartKey side={side} /></div>
        </figure>

        <figure className="min-w-0 lg:col-span-5">
          <h2 className="font-display text-2xl">Divergence</h2>
          <p className="mb-6 mt-1 font-ui text-xs text-muted">
            Modi India minus Rahul India, in {item.unit || "index units"}.
          </p>
          <GapChart series={item.series} unit={item.unit} height={300} />
        </figure>
      </section>

      <section className="grid gap-14 border-t border-border py-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <h2 className="font-display text-2xl">What Rahul&rsquo;s India is made of</h2>
          <p className="mb-6 mt-1 font-ui text-xs text-muted">
            Donor weights, solved on pre-2014 data. {item.donors} countries in the pool;
            those not listed carry zero weight.
          </p>
          <ul className="space-y-2.5">
            {item.weights.map((w) => (
              <li key={w.c} className="flex items-center gap-3">
                <span className="w-28 shrink-0 font-ui text-sm">{COUNTRY[w.c] ?? w.c}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-rahul transition-all duration-700 ease-out"
                       style={{ width: `${Math.min(w.w * 100, 100)}%` }} />
                </div>
                <span className="num w-14 shrink-0 text-right text-xs text-muted">
                  {(w.w * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <h2 className="font-display text-2xl">Method &amp; reliability</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {[
              ["Measure", item.variable],
              ["Source type", item.source === "DIRECT" ? "Direct measure" : "Cross-country proxy"],
              ["Estimation window", item.preWindow],
              ["Projection window", item.postWindow],
              ["Donor pool", `${item.donors} countries`],
              ["Pre-2014 fit (RMSPE)", `${item.fit.toFixed(1)}% of pre-period mean`],
              ["Placebo rank", item.rank ?? "not tested"],
              ["Standardised p-value", item.p === null ? "not tested" : item.p.toFixed(3)],
              ["BH-adjusted q across tier 1", item.q === null || item.q === undefined ? "—" : item.q.toFixed(3)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="font-ui text-xs uppercase tracking-wider text-muted">{k}</dt>
                <dd className="num text-right text-sm">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-ui text-[11px] leading-relaxed text-muted">
            The q-value applies a Benjamini–Hochberg correction across all
            {" "}{data.tier1.length} indicators with a counterfactual. We report p as the primary
            figure because each indicator is treated as a separate question rather than one family
            of hypotheses — but no result on this site survives q ≤ 0.10, and a reader who prefers
            the family view should read the p-values accordingly.
          </p>
          {item.tier === 2 && (
            <p className="mt-6 rounded-md border-l-2 border-accent bg-accent/[0.04] px-4 py-3
                          font-ui text-xs leading-relaxed text-muted">
              Pre-2014 fit is {item.fit.toFixed(1)}% of the pre-period mean. The method could not
              reproduce India&rsquo;s own path before 2014, so the post-2014 difference is not
              interpretable as an effect.
            </p>
          )}
          {item.note && (
            <p className="mt-4 font-ui text-xs leading-relaxed text-muted">{item.note}</p>
          )}
        </div>
      </section>

      <Method item={item} />

      {item.related?.length ? (
        <section className="border-t border-border py-14">
          <h2 className="font-display text-2xl">Related measures</h2>
          <p className="mb-8 mt-1 max-w-reading font-ui text-xs text-muted">
            Other series bearing on the same question, each with its own counterfactual.
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            {item.related.map((r) => {
              const rSide = (r.lowerIsBetter ? r.gapPct < 0 : r.gapPct > 0) ? "modi" : "rahul";
              return (
                <figure key={r.variable} className="min-w-0">
                  <figcaption className="mb-1 flex flex-wrap items-center gap-3">
                    <span className="font-display text-lg">{r.title}</span>
                    <Verdict side={rSide} />
                  </figcaption>
                  <p className="mb-4 font-ui text-[11px] text-muted">
                    pre-2014 fit {r.fit.toFixed(1)}%
                    {r.rank ? ` · rank ${r.rank}` : ""}
                    {r.p !== null ? ` · ${pLabel(r.p)}` : ""}
                  </p>
                  <Chart series={r.series} unit={r.unit} height={210} compact />
                  <dl className="mt-3 flex gap-6 border-t border-border pt-3">
                    <div><dt className="eyebrow">Rahul</dt>
                      <dd className="num text-sm text-rahulInk">{fmt(r.rahul, r.unit)}</dd></div>
                    <div><dt className="eyebrow">Modi</dt>
                      <dd className="num text-sm text-modiInk">{fmt(r.modi, r.unit)}</dd></div>
                    <div className="ml-auto text-right"><dt className="eyebrow">Difference</dt>
                      <dd className={`num text-sm ${rSide === "modi" ? "text-modiInk" : "text-rahulInk"}`}>
                        {pct(r.gapPct)}</dd></div>
                  </dl>
                </figure>
              );
            })}
          </div>
        </section>
      ) : null}

      <nav className="flex items-stretch justify-between gap-4 border-t border-border pt-8">
        {prev ? (
          <Link to={`/indicator/${prev.id}`}
            className="group flex-1 rounded-lg border border-border p-4 transition-all duration-300
                       hover:border-rahul/40 hover:bg-rahul/[0.04]">
            <p className="eyebrow">← Previous</p>
            <p className="mt-1 font-display text-base group-hover:text-rahulInk transition-colors">{prev.title}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link to={`/indicator/${next.id}`}
            className="group flex-1 rounded-lg border border-border p-4 text-right transition-all
                       duration-300 hover:border-rahul/40 hover:bg-rahul/[0.04]">
            <p className="eyebrow">Next →</p>
            <p className="mt-1 font-display text-base group-hover:text-rahulInk transition-colors">{next.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </nav>

      <p className="mt-12 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
        {data.meta.caveat} Sources: {data.meta.sources.join("; ")}.
      </p>
    </article>
  );
}
