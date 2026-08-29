import { Link } from "react-router-dom";
import { useEffect } from "react";
import { data } from "../lib/data";
import { Chart } from "../components/Chart";
import { SecurityRadar } from "../components/SecurityRadar";
import { ThemeLine, ThemeBars, ThemeHeat } from "../components/ThemeCharts";
import { fmt } from "../lib/format";
import { everyday, byGroup } from "../lib/everyday";

/** Sector notes. Descriptive: what moved, over what period. */
const NOTE: Record<number, string> = {
  1: "Output roughly doubled in dollar terms across the decade, outpacing what comparable economies managed from the same starting point.",
  2: "Goods and services sold abroad kept climbing through the pandemic dip and past it, led by services rather than merchandise.",
  4: "Foreign direct investment held near record levels through a decade in which global flows to emerging markets contracted.",
  5: "Reserves passed $600bn, giving the Reserve Bank far deeper cover against currency pressure than it held in 2013.",
  44: "Electronics output multiplied as assembly moved onshore, turning a net importer of handsets into an exporter.",
  43: "Under-five deaths nearly halved. India pulled further ahead of the countries that shared its trajectory before 2014.",
  42: "Deaths in the first month of life fell steadily, the hardest part of child mortality to move.",
  37: "The share of households pushed past a tenth of their budget by medical bills fell by half.",
  38: "Households now pay a far smaller share of the health bill directly, as public financing took over more of it.",
  41: "Infant deaths continued their long decline and stayed below the counterfactual throughout.",
  12: "The national highway network grew by more than half, with four-lane and access-controlled stock rising fastest.",
  17: "Operational metro track grew several times over, from two cities of any scale to more than twenty.",
  25: "Cargo through Indian ports rose steadily while turnaround times roughly halved.",
  20: "Broad-gauge electrification moved from a minority of the network to almost all of it.",
  18: "Metro systems opened in city after city, spreading urban rail well beyond the metros that had it in 2014.",
  203: "Civilian deaths from terrorism in Jammu & Kashmir fell to a fraction of the previous decade's toll.",
  206: "Civilian deaths in Maoist-affected districts fell sharply as the affected area contracted.",
  207: "Security-force losses to left-wing extremism fell by roughly three quarters.",
  209: "Northeast civilian deaths fell furthest of any theatre, alongside a series of settlements.",
  211: "Explosion incidents across all theatres fell by well over half, and by 2024 stood at a fifth of the 2004 level.",
};

export default function Modi() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const m = data.modiPage;
  const eco = m.eco, sec = m.sec;

  return (
    <article className="mx-auto max-w-5xl px-6 py-14">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 transition-colors
                              duration-300 hover:text-modiInk">← Back to the comparison</Link>

      <header className="mt-6 border-b border-border pb-10">
        <p className="eyebrow mb-4">The other side · 2014 – 2024</p>
        <h1 className="max-w-[24ch] font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl">
          Modi&rsquo;s India is{" "}
          <span className="italic text-modiInk">13% richer</span> and{" "}
          <span className="italic text-modiInk">66% safer</span>
        </h1>
        <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
          The same two comparisons, read from the other direction. Where the front page asks what
          India would have lost, this asks what it gained — across the economy, health,
          infrastructure and internal security.
        </p>
      </header>

      {/* headline pair */}
      <section className="grid gap-12 border-b border-border py-14 lg:grid-cols-2">
        <figure className="min-w-0">
          <p className="eyebrow">Income · real GDP per capita, PPP</p>
          <p className="num mt-2 text-4xl text-modiInk">
            +{eco.gapPct.toFixed(0)}<span className="text-2xl">%</span>
          </p>
          <p className="mb-6 mt-1 font-ui text-[13px] text-muted">
            {fmt(eco.synth, "USD")} projected · {fmt(eco.actual, "USD")} actual
          </p>
          <Chart series={eco.series} unit="USD" height={230} />
        </figure>
        <figure className="min-w-0">
          <p className="eyebrow">Security · all-theatre fatalities a year</p>
          <p className="num mt-2 text-4xl text-modiInk">
            −{Math.abs(sec.gapPct).toFixed(0)}<span className="text-2xl">%</span>
          </p>
          <p className="mb-6 mt-1 font-ui text-[13px] text-muted">
            {sec.synth.toLocaleString()} a year before 2014 · {sec.actual.toLocaleString()} after
          </p>
          <SecurityRadar />
        </figure>
      </section>

      {/* four themes */}
      {m.themes.map((t, ti) => (
        <section key={t.theme} className="border-b border-border py-14">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="eyebrow">0{ti + 2} — sector</p>
            <h2 className="font-display text-3xl">{t.theme}</h2>
            <p className="max-w-reading font-ui text-[13px] text-muted">{t.why}</p>
          </div>

          <ThemeHeat items={t.items} />

          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
            {t.items.map((it) => (
              <figure key={it.id} className="min-w-0">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4">
                  <Link to={`/indicator/${it.id}`}
                    className="font-display text-lg transition-colors duration-300 hover:text-modiInk">
                    {it.title}
                  </Link>
                  <span className="num text-lg text-modiInk">
                    {it.gap > 0 ? "+" : ""}{it.gap.toFixed(0)}%
                  </span>
                </div>
                <p className="mb-4 font-ui text-[11px] text-muted">
                  {it.unit} · {fmt(it.rahul, it.unit)} → {fmt(it.modi, it.unit)}
                </p>
                {t.chart === "bars" ? <ThemeBars item={it} /> : <ThemeLine item={it} />}
                <figcaption className="mt-3 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
                  {NOTE[it.id]}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">{everyday.label}</p>
        <h2 className="font-display text-3xl">
          {everyday.title} — <span className="num text-modiInk">{everyday.counts.later} leads</span>
        </h2>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          The later period records faster normalised improvement on {everyday.counts.later} of the{" "}
          {everyday.counts.total} selected basic lived-development measures. Counted separately
          from the national indicators above.
        </p>
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byGroup("later").reduce((acc, i) => {
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
        <p className="mt-8 max-w-reading rounded-md border-l-2 border-border bg-border/10 px-4 py-3
                      font-ui text-[13px] leading-relaxed text-muted">
          {everyday.counts.comparable} further measures are broadly comparable despite the later
          period inheriting much higher starting coverage, and {everyday.counts.earlier} show
          faster earlier-period progress.{" "}
          <Link to="/everyday" className="text-modiInk underline-offset-2 hover:underline">
            See all {everyday.counts.total}
          </Link>.
        </p>
      </section>

      <section className="py-14">
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-modi/50 hover:text-modiInk">
            ← Back to the comparison
          </Link>
          <Link to="/read" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-rahul/50 hover:text-rahulInk">
            The other side, in full →
          </Link>
          <Link to="/everyday" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-modi/50 hover:text-modiInk">
            Everyday India →
          </Link>
        </div>
      </section>
    </article>
  );
}
