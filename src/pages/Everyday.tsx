import { Link } from "react-router-dom";
import { useEffect } from "react";
import { everyday, byGroup } from "../lib/everyday";
import { EverydayCard } from "../components/EverydayCard";
import { data } from "../lib/data";

/** The saturation case, taught with the clearest example. */
function Saturation() {
  const inst = everyday.items.find((i) => i.id === "institutional_births")!;
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="eyebrow mb-3">Why raw percentage points mislead</p>
      <h3 className="font-display text-2xl">Institutional births</h3>
      <p className="num mt-3 text-2xl">
        <span className="text-muted">{inst.v2005}%</span>
        <span className="mx-2 text-border">→</span>
        <span className="text-muted">{inst.v2015}%</span>
        <span className="mx-2 text-border">→</span>
        <span className="text-ink">{inst.v2023}%</span>
      </p>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="border-t border-border pt-3">
          <dt className="eyebrow">Raw change</dt>
          <dd className="num mt-1 text-lg">
            <span className="text-rahulInk">+{inst.rawEarlier}pp</span>
            <span className="mx-2 text-muted">vs</span>
            <span className="text-modiInk">+{inst.rawLater}pp</span>
          </dd>
          <dd className="mt-1 font-ui text-[11px] text-muted">Earlier period looks far ahead.</dd>
        </div>
        <div className="border-t border-border pt-3">
          <dt className="eyebrow">Adjusted annual rate</dt>
          <dd className="num mt-1 text-lg">
            <span className="text-rahulInk">{inst.normEarlier}%</span>
            <span className="mx-2 text-muted">vs</span>
            <span className="text-modiInk">{inst.normLater}%</span>
          </dd>
          <dd className="mt-1 font-ui text-[11px] text-muted">Broadly comparable.</dd>
        </div>
      </dl>
      <p className="mt-5 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
        The later period began at nearly {inst.v2015}% coverage, so far less room remained. Once
        the remaining gap is accounted for, the two periods advanced at almost the same pace. This
        is why the section reports normalised rates rather than percentage-point totals.
      </p>
    </div>
  );
}

export default function Everyday() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const c = everyday.counts;
  const groups = [
    { key: "later" as const, n: c.later, title: "Modi ahead",
      blurb: "Faster normalised improvement in 2015–16 → 2023–24." },
    { key: "comparable" as const, n: c.comparable, title: "Broadly comparable",
      blurb: "Within 10% of each other once starting position is accounted for." },
    { key: "earlier" as const, n: c.earlier, title: "Rahul leads",
      blurb: "Faster normalised improvement in 2005–06 → 2015–16." },
  ];

  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 transition-colors
                              duration-300 hover:text-rahulInk">← Back to the comparison</Link>

      <header className="mt-6 border-b border-border pb-12">
        <p className="eyebrow mb-4">{everyday.label}</p>
        <h1 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          {everyday.title}
        </h1>
        <p className="mt-3 max-w-[30ch] font-display text-2xl italic text-muted">
          {everyday.subtitle}
        </p>

        <div className="mt-8 max-w-reading space-y-4 font-body text-lg leading-relaxed text-muted">
          <p>
            India&rsquo;s development cannot be understood only through GDP, elections, markets,
            highways or geopolitical power. For millions of Indians, development is also much more
            immediate. Will a pregnant woman receive medical care early enough? Will she get iron
            and folic acid? Will she receive care after delivery? Will her child receive essential
            vaccines? Is severe childhood wasting falling? Can the family reach health financing?
          </p>
          <p>
            These questions rarely dominate political debate in wealthy countries, because those
            societies largely crossed these thresholds decades ago. A voter in London or New York
            seldom argues about whether 80% or 90% of births happen in a medical facility, because
            near-universal access is already assumed. In India that difference is millions of
            mothers.
          </p>
          <p>
            So alongside the project&rsquo;s {data.tier1.length + data.tier2.length + data.untestable.length}{" "}
            national indicators, Everyday India examines {c.total} selected measures of basic lived
            development. <span className="text-ink">The results are not one-sided.</span>
          </p>
        </div>

        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            [c.later, "Modi ahead", "text-modiInk", "border-modi/30 bg-modi/[0.06]"],
            [c.earlier, "Rahul leads", "text-rahulInk", "border-rahul/30 bg-rahul/[0.06]"],
            [c.comparable, "Broadly comparable", "text-muted", "border-border bg-border/15"],
          ].map(([n, label, tone, box]) => (
            <div key={label as string} className={`rounded-lg border p-5 ${box}`}>
              <dt className={`num text-4xl ${tone}`}>{n as number}</dt>
              <dd className="mt-1 font-ui text-[13px] text-ink">{label as string}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-ui text-[11px] text-muted">
          Across {c.total} selected Everyday India measures, the later period records faster
          normalised improvement on {c.later}, the earlier period leads on {c.earlier}, and{" "}
          {c.comparable} are broadly comparable. These are counted separately from the national
          analysis and are not added to it.
        </p>
      </header>

      {/* method */}
      <section className="border-b border-border py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <h2 className="font-display text-2xl">How the pace is measured</h2>
            <p className="mt-3 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
              38% → 79% cannot be set against 79% → 91% using percentage points alone: the second
              starts far closer to the ceiling. Each period is therefore scored on how much of the
              distance still available to it was closed, per year.
            </p>
            <dl className="mt-6 space-y-4">
              {[["Higher is better", everyday.method.higher],
                ["Lower is better", everyday.method.lower],
                ["Calling a lead", everyday.method.threshold]].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-1 font-ui text-[13px] leading-relaxed text-muted">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-ui text-[11px] leading-relaxed text-muted">
              Periods: {everyday.periods.earlier} ({everyday.periods.earlierYears} years) and{" "}
              {everyday.periods.later} ({everyday.periods.laterYears} years). The intervals differ,
              so every rate is annualised. {everyday.method.caution}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7"><Saturation /></div>
        </div>
      </section>

      {/* the three groups */}
      {groups.map((g) => (
        <section key={g.key} className="border-b border-border py-14">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-display text-3xl">
              <span className={`num mr-3 ${g.key === "later" ? "text-modiInk"
                : g.key === "earlier" ? "text-rahulInk" : "text-muted"}`}>{g.n}</span>
              {g.title}
            </h2>
            <p className="font-ui text-[13px] text-muted">{g.blurb}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {byGroup(g.key).map((i) => <EverydayCard key={i.id} item={i} />)}
          </div>
          {g.key === "comparable" && (
            <p className="mt-6 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
              These are the cases where raw percentage-point change strongly favours the earlier
              period, but that comparison is distorted because the later period starts much closer
              to universal coverage. Skilled birth attendance is the marginal case: its margin is
              10.5%, just past the 10% line, so a stricter reading would place it with the
              earlier-period leads.
            </p>
          )}
        </section>
      ))}

      <section className="py-14">
        <p className="max-w-reading rounded-md border-l-2 border-border bg-border/10 px-4 py-3
                      font-ui text-[13px] leading-relaxed text-muted">
          This is not a one-direction scorecard. {c.earlier} measures show faster earlier-period
          progress and {c.comparable} are classified as broadly comparable. Those results stay
          visible alongside the {c.later} later-period leads.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full border border-border bg-surface px-5 py-2.5
                                  font-ui text-sm transition-all duration-300
                                  hover:border-rahul/50 hover:text-rahulInk">
            ← Back to the comparison
          </Link>
        </div>
      </section>
    </article>
  );
}
