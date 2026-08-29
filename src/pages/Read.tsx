import { Link } from "react-router-dom";
import { useEffect } from "react";
import { data, all, untestable, COUNTRY } from "../lib/data";
import { Chart } from "../components/Chart";
import { quadrantVerdict, fmt } from "../lib/format";
import { Robustness } from "../components/Robustness";
import { everyday, byGroup } from "../lib/everyday";
import { SecurityDecade } from "../components/SecurityDecade";
import { Sectors } from "../components/Sectors";
import { SwitchSideBlock } from "../components/SwitchSide";
import { SecurityRadar } from "../components/SecurityRadar";

/** Combined annual fatalities across the three theatres, drawn as bars. */
function SecurityBars() {
  const s = data.securitySeries;
  const mx = Math.max(...s.points.map((p) => p.total));
  return (
    <div>
      <ul className="flex h-[240px] items-end gap-[3px]" aria-hidden="true">
        {s.points.map((p) => (
          <li key={p.year} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div className={`w-full rounded-t-sm ${p.year >= 2014 ? "bg-modi/60" : "bg-muted/30"}`}
                 style={{ height: `${4 + (p.total / mx) * 190}px` }} />
            <span className="num text-[8px] text-muted">{String(p.year).slice(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-ui text-[11px] text-muted">
        <span><span className="inline-block h-2 w-3 rounded-sm bg-muted/30 align-middle" /> 2000–2013</span>
        <span><span className="inline-block h-2 w-3 rounded-sm bg-modi/60 align-middle" /> 2014–2024</span>
        <span>peak {s.peakYear}: <span className="num">{s.peak.toLocaleString()}</span></span>
      </p>
    </div>
  );
}

export default function Read() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const v = quadrantVerdict(data.quadrant);
  const eco = data.quadrant.economy;
  const sec = data.quadrant.security;
  const s = data.securitySeries;
  const secCards = untestable.filter((u) => u.set === "security");
  const rahulAhead = [...all, ...untestable].filter((i) => i.verdictSide === "rahul");
  const combinedChange = (100 * (s.postMean - s.preMean)) / s.preMean;

  return (
    <article className="mx-auto max-w-5xl px-6 py-14">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 transition-colors
                              duration-300 hover:text-rahulInk">← Back to the comparison</Link>

      <header className="mt-6 border-b border-border pb-10">
        <p className="eyebrow mb-4">The counterfactual · 2014 – 2024</p>
        <h1 className="max-w-[26ch] font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
          Rahul&rsquo;s India would have been{" "}
          <span className="italic text-rahulInk">{v.ecoPhrase}</span>
          {v.secNull ? (
            <>, with <span className="italic text-muted">no measurable difference in security</span></>
          ) : (
            <> and <span className="italic text-rahulInk">{v.secPhrase}</span></>
          )}
        </h1>
        <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
          The same two comparisons, read from this side. Where the Modi page asks what India
          gained, this asks what it would have lost — across the economy, health, infrastructure
          and internal security. The working behind both numbers is at the foot of the page.
        </p>
      </header>

      {/* headline pair — the Modi page's opening, flipped */}
      <section className="grid gap-12 border-b border-border py-14 lg:grid-cols-2">
        <figure className="min-w-0">
          <p className="eyebrow">Income · real GDP per capita, PPP</p>
          <p className="num mt-2 text-4xl text-rahulInk">
            −{Math.abs(eco.gapPct).toFixed(0)}<span className="text-2xl">%</span>
          </p>
          <p className="mb-6 mt-1 font-ui text-[13px] text-muted">
            {fmt(eco.actual, "USD")} actual · {fmt(eco.synth, "USD")} projected
          </p>
          <Chart series={eco.series} unit="USD" height={230} />
          <SwitchSideBlock to="modi" />
        </figure>
        <figure className="min-w-0">
          <p className="eyebrow">Security · all-theatre fatalities a year</p>
          <p className="num mt-2 text-4xl text-rahulInk">
            +{Math.abs(sec.gapPct).toFixed(0)}<span className="text-2xl">%</span>
          </p>
          <p className="mb-6 mt-1 font-ui text-[13px] text-muted">
            {sec.actual.toLocaleString()} a year after 2014 · {sec.synth.toLocaleString()} before
          </p>
          <SecurityRadar />
        </figure>
      </section>

      <Sectors side="rahul" startAt={2} />

      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">{everyday.label}</p>
        <h2 className="font-display text-3xl">
          {everyday.title} — <span className="num text-rahulInk">{everyday.counts.earlier} earlier-period leads</span>
        </h2>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          On {everyday.counts.earlier} of the {everyday.counts.total} selected lived-development
          measures, the earlier period improved faster once starting position is accounted for.
        </p>
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {Object.entries(byGroup("earlier").reduce((acc, i) => {
            (acc[i.category] ||= []).push(i.name); return acc;
          }, {} as Record<string, string[]>)).map(([cat, names]) => (
            <div key={cat} className="border-t border-border pt-3">
              <dt className="eyebrow">{cat}</dt>
              <dd className="mt-1.5 font-ui text-[12px] leading-relaxed text-muted">
                {names.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-reading rounded-md border-l-2 border-rahul/40 bg-rahul/[0.04]
                      px-4 py-3 font-ui text-[13px] leading-relaxed text-muted">
          The earlier period also established substantial progress on several other measures,
          including institutional births and skilled birth attendance. After adjusting for
          starting position, {everyday.counts.comparable} of those are classified as broadly
          comparable rather than a lead for either side.{" "}
          <Link to="/everyday" className="text-rahulInk underline-offset-2 hover:underline">
            See all {everyday.counts.total}
          </Link>.
        </p>
      </section>

      {/* ── where the counterfactual wins ──────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">06 — Where Rahul&rsquo;s India is ahead</p>
        <h2 className="font-display text-3xl">
          <span className="num text-rahulInk">{rahulAhead.length}</span>{" "}
          national {rahulAhead.length === 1 ? "indicator runs" : "indicators run"} the other way
        </h2>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Most of this page describes a shortfall. {rahulAhead.length === 1 ? "This one does" : "These do"}{" "}
          not: here the estimated path is the one in front. A small minority, and shown rather
          than buried because a page that only reported losses would not be worth trusting on
          the rest.
        </p>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {rahulAhead.map((i) => (
            <li key={i.id}>
              <Link to={`/indicator/${i.id}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3
                           transition-colors duration-300 hover:bg-rahul/[0.04]">
                <span className="min-w-0 flex-1 font-ui text-[13px] group-hover:text-rahulInk">
                  {i.title}
                </span>
                <span className="eyebrow">national indicator</span>
                <span className="num w-20 text-right text-sm text-rahulInk">Rahul leads</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
          {everyday.counts.earlier} more sit in the Everyday India layer directly above, scored on
          normalised rates of improvement so a period that started further behind is not credited
          for the easier gains.
        </p>
      </section>


      {/* ── 13% poorer ─────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">07 — The wealth gap</p>
        <h2 className="font-display text-3xl">
          <span className="num text-rahulInk">{Math.abs(v.eco).toFixed(0)}%</span> poorer
        </h2>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Real GDP per capita, adjusted for purchasing power. India&rsquo;s actual path is the
          orange line; Rahul&rsquo;s India — the weighted blend of {eco.donors} comparator
          economies whose pre-2014 paths tracked India&rsquo;s — is the blue dashed line. The two
          are indistinguishable before 2014 by construction, and separate afterwards.
        </p>

        <dl className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-4">
          {[
            ["Rahul's India", fmt(eco.synth, "USD"), "text-rahulInk", `projected ${eco.end}`],
            ["Modi's India", fmt(eco.actual, "USD"), "text-modiInk", `actual ${eco.end}`],
            ["Difference", `${eco.gapPct > 0 ? "+" : ""}${eco.gapPct.toFixed(0)}%`, "text-modiInk", "in Modi's favour"],
            ["Placebo rank", eco.rank ?? "—", "text-ink", `p = ${eco.p?.toFixed(3)}`],
          ].map(([k, val, cls, sub]) => (
            <div key={k as string}>
              <dt className="eyebrow">{k}</dt>
              <dd className={`num mt-1 text-2xl ${cls}`}>{val}</dd>
              <dd className="mt-1 font-ui text-[11px] text-muted">{sub}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <p className="eyebrow mb-3">What Rahul&rsquo;s India is made of</p>
          <ul className="space-y-2">
            {eco.weights.slice(0, 6).map((w) => (
              <li key={w.c} className="flex items-center gap-3">
                <span className="w-28 shrink-0 font-ui text-[13px]">{COUNTRY[w.c] ?? w.c}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-rahul" style={{ width: `${w.w * 100}%` }} />
                </div>
                <span className="num w-12 text-right text-xs text-muted">{(w.w * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-ui text-[11px] leading-relaxed text-muted">
            The blend reproduces India&rsquo;s own pre-2014 path to within {eco.fit?.toFixed(1)}%.
            Re-running the whole procedure pretending each comparator was the country treated in
            2014 puts India at rank {eco.rank}, p = {eco.p?.toFixed(3)} — a gap larger than chance
            usually produces.
          </p>
        </div>
      </section>

      {/* ── the security number ─────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">08 — The security gap</p>
        <h2 className="font-display text-3xl">
          <span className="num text-rahulInk">{Math.abs(v.sec).toFixed(0)}%</span> less secure
        </h2>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Violence did fall after 2014 — all-theatre fatalities are down 26% on 2013 and battle
          deaths per million down 30%. The question this site asks is different: did it fall by
          more than comparable countries managed? On the one security measure with a
          counterfactual behind it — UCDP battle-related deaths per million, against {sec.donors}{" "}
          comparator countries — the answer is no. India&rsquo;s gap oscillates around zero across
          the whole period and lands at rank {sec.rank}, p = {sec.p?.toFixed(3)}. Three ways of
          asking give three different answers, set out below.
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-y border-border">
                <th className="py-2 pr-4 font-ui text-[11px] uppercase tracking-wider text-muted">Method</th>
                <th className="py-2 pr-4 text-right font-ui text-[11px] uppercase tracking-wider text-muted">Gap</th>
                <th className="py-2 text-right font-ui text-[11px] uppercase tracking-wider text-muted">Placebo test</th>
              </tr>
            </thead>
            <tbody>
              {sec.variants.map((v, i) => (
                <tr key={v.spec} className="border-b border-border">
                  <td className="py-3 pr-4 font-ui text-[13px]">{v.spec}</td>
                  <td className={`num py-3 pr-4 text-right text-sm ${
                    v.gapPct > 0 ? "text-rahulInk" : "text-modiInk"}`}>
                    {v.gapPct > 0 ? "+" : ""}{v.gapPct}%
                  </td>
                  <td className="py-3 text-right font-ui text-[12px] text-muted">
                    {i === 0 ? `rank ${sec.rank}, p = ${sec.p?.toFixed(3)}` : "none available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-reading rounded-md border-l-2 border-accent bg-accent/[0.04]
                      px-4 py-3 font-ui text-[13px] leading-relaxed text-muted">
          {sec.variantsNote}
        </p>

        <div className="mt-8">
          <p className="eyebrow mb-4">
            Combined fatalities — Jammu &amp; Kashmir, left-wing extremism, the Northeast
          </p>
          <SecurityBars />
          <p className="mt-4 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
            Averaging <span className="num">{s.preMean.toLocaleString()}</span> deaths a year over
            2004–2013 and <span className="num text-modiInk">{s.postMean.toLocaleString()}</span>{" "}
            over 2014–2024 gives a fall of{" "}
            <span className="num text-modiInk">{Math.abs(combinedChange).toFixed(0)}%</span> — but
            that comparison hides where the fall happened, because the earlier window contains the
            violent early 2000s. Splitting it finer shows two separate shifts.
          </p>

          <div className="mt-8">
            <p className="eyebrow mb-4">Period averages</p>
            <ul className="space-y-2">
              {s.periods.map((pr) => {
                const mx = Math.max(...s.periods.map((z) => z.mean));
                return (
                  <li key={pr.label} className="flex items-center gap-3">
                    <span className="num w-24 shrink-0 text-[12px] text-muted">{pr.label}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-sm bg-border/40">
                      <div className={`h-full rounded-sm ${pr.era === "post" ? "bg-modi/60" : "bg-muted/40"}`}
                           style={{ width: `${(pr.mean / mx) * 100}%` }} />
                    </div>
                    <span className="num w-14 shrink-0 text-right text-[12px]">
                      {pr.mean.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
              The first Modi term is flat: <span className="num">864</span> a year over 2014–2018
              against <span className="num">902</span> over 2011–2013,{" "}
              <span className="num">{s.firstTermChange}%</span>. The shift lands in 2019 — the
              single largest post-2014 drop is{" "}
              <span className="num text-modiInk">{s.shifts[1].at} {s.shifts[1].pct}%</span> — after
              which the average is <span className="num text-modiInk">546</span>, down{" "}
              <span className="num text-modiInk">{Math.abs(s.secondTermChange)}%</span> on the first
              term. The larger break in the whole series is earlier still:{" "}
              <span className="num">{s.shifts[0].at} {s.shifts[0].pct}%</span>, in 2011.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-2">Parameter by parameter, on decade totals</p>
          <p className="mb-6 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
            Year-to-year conflict counts swing on single events, so decade totals are the sounder
            unit. Here are the seven parameters with annual data behind them, under the decade
            comparison and against the three years immediately before 2014.
          </p>
          <SecurityDecade />
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-4">All ten, as supplied</p>
          <ul className="divide-y divide-border border-y border-border">
            {secCards.map((u) => (
              <li key={u.id}>
                <Link to={`/indicator/${u.id}`}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5
                             transition-colors duration-300 hover:bg-modi/[0.04]">
                  <span className="min-w-0 flex-1 truncate font-ui text-[13px]
                                   group-hover:text-modiInk">{u.title}</span>
                  <span className="num text-[11px] text-muted">
                    {u.observedChange?.base?.toLocaleString()} → {u.observedChange?.latest?.toLocaleString()}
                  </span>
                  <span className="num w-14 text-right text-sm text-modiInk">
                    {u.observedChange?.changePct?.toFixed(0)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 max-w-reading rounded-md border-l-2 border-accent bg-accent/[0.04]
                      px-4 py-3 font-ui text-[13px] leading-relaxed text-muted">
          So there is a real post-2014 shift, and it is in the second term rather than the first.
          What the cross-country test adds is the comparison: conflict levels in the comparator
          countries fell over those same years, so India&rsquo;s decline does not separate from
          theirs — rank {sec.rank}, p = {sec.p?.toFixed(3)}. The decline is visible in the data;
          what cannot be shown is that it is specific to India.
        </p>
      </section>

      <section className="py-14">
        <p className="eyebrow mb-3">09 — The two numbers are not alike</p>
        <h2 className="font-display text-3xl">One is tested, one is arithmetic</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="eyebrow mb-2">{Math.abs(v.eco).toFixed(0)}% poorer</p>
            <p className="font-ui text-[13px] leading-relaxed text-muted">
              Estimated from {eco.donors} comparator economies, validated against India&rsquo;s own
              pre-2014 path to {eco.fit?.toFixed(1)}%, and tested against every comparator as a
              placebo — rank {eco.rank}, p = {eco.p?.toFixed(3)}. It clears three of the four
              robustness runs above, and fails the fourth.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="eyebrow mb-2">{Math.abs(v.sec).toFixed(0)}% less secure</p>
            <p className="font-ui text-[13px] leading-relaxed text-muted">
              Arithmetic on India&rsquo;s own totals, not an estimate: {sec.synth.toLocaleString()}{" "}
              deaths a year across 2004–2013 against {sec.actual.toLocaleString()} across
              2014–2024. Every one of the eleven parameters improves, so it does not rest on a
              single series — but there is no comparator and no placebo test, so nothing
              constrains it. Put to cross-country conflict data instead, the same question
              returns +6.5% at rank 25/36, p = 0.694.
            </p>
          </div>
        </div>
      </section>

      {/* ── does the 13% hold? — the methods block, parked at the bottom ── */}
      <section className="border-t border-border py-14">
        <p className="eyebrow mb-3">10 — Does it hold?</p>
        <h2 className="font-display text-3xl">Four ways to break the wealth figure</h2>
        <p className="mb-8 mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          A gap against a counterfactual is only as good as the counterfactual. These are the
          standard attacks on a synthetic control estimate, run against this one.
        </p>
        <Robustness />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-rahul/50 hover:text-rahulInk">
            ← Back to the comparison
          </Link>
          <Link to="/indicator/38" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-rahul/50 hover:text-rahulInk">
            The strongest measured result →
          </Link>
        </div>
      </section>
    </article>
  );
}