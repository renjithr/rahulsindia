import { Link } from "react-router-dom";
import { data, ordered, untestable, all } from "../lib/data";
import { Carousel } from "../components/Carousel";
import { Quadrant } from "../components/Quadrant";
import { usePov } from "../lib/pov";
import { everyday } from "../lib/everyday";
import { WhyThisExists, ThreeStages, Fairness } from "../components/Framing";
import { SecurityRadar } from "../components/SecurityRadar";
import { Card } from "../components/Card";
import { ObservedCard } from "../components/ObservedCard";


export default function Home() {
  const sig = data.tier1.filter((i) => i.significant).length;
  const every = [...all, ...untestable];
  // Capacity the state builds, against outcomes households live with.
  const BUILT = new Set([
    "Roads, Railways, Airports, Metros and Waterways",
    "Energy and Household Infrastructure",
    "Manufacturing and Defence",
    "Housing",
  ]);
  const observedCards = untestable.filter((u) => u.set !== "security");
  const built = observedCards.filter((u) => BUILT.has(u.category));
  const households = observedCards.filter((u) => !BUILT.has(u.category));
  // Both layers count into one total. The national indicators are measured
  // against a counterfactual or against India's own past; the Everyday measures
  // are scored on normalised rates of improvement. Different methods, one count.
  const total = every.length + everyday.counts.total;
  const modiAhead = every.filter((i) => i.verdictSide === "modi").length + everyday.counts.later;
  const rahulAhead = every.filter((i) => i.verdictSide === "rahul").length + everyday.counts.earlier;
  const { pov, verdict, subject, otherSubject, hero } = usePov();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-6 pb-14 pt-16 lg:grid-cols-12 lg:gap-14 lg:pt-24">
          <div className="min-w-0 lg:col-span-6">
            <p className="eyebrow mb-5">
              {total} indicators · two trajectories · one comparison
            </p>
            <h1 className="font-display text-4xl leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              The India the headlines don&rsquo;t{" "}
              <span className="italic text-rahulInk">fully explain</span>
            </h1>
            <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
              Since 2014, much international discussion of India has focused on politics,
              institutions and social conflict. This project looks at another question: what
              actually happened to India&rsquo;s infrastructure, security, economy, digital systems
              and state capacity?
            </p>
            <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
              Across {total} indicators it compares the India that emerged under Narendra
              Modi with an estimated alternative —{" "}
              <span className="text-ink">what if Rahul Gandhi had become Prime Minister in 2014
              and the broad UPA-era trajectory had continued?</span>{" "}
              The point is not to show that India improved. It is to ask whether India improved
              more than we should reasonably have expected without the post-2014 change.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#whole" className="rounded-full bg-ink px-5 py-2.5 font-ui text-sm
                                          font-semibold text-background transition-all
                                          duration-300 hover:bg-rahulInk">
                See what changed
              </a>
              <a href="#why" className="rounded-full border border-border bg-surface px-5 py-2.5
                                        font-ui text-sm transition-all duration-300
                                        hover:border-rahul/50 hover:text-rahulInk">
                Why this project exists
              </a>
              <Link to="/everyday" className="rounded-full border border-border bg-surface px-5 py-2.5
                                        font-ui text-sm transition-all duration-300
                                        hover:border-modi/50 hover:text-modiInk">
                Everyday India
              </Link>
            </div>

            <dl className="mt-9 border-t border-border pt-6">
              <dt className="eyebrow">Of which {everyday.counts.total} are Everyday India measures</dt>
              <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="num text-2xl text-modiInk">{everyday.counts.later}</span>
                <span className="font-ui text-[11px] text-muted">Modi ahead</span>
                <span className="num text-2xl text-rahulInk">{everyday.counts.earlier}</span>
                <span className="font-ui text-[11px] text-muted">Rahul leads</span>
                <span className="num text-2xl text-muted">{everyday.counts.comparable}</span>
                <span className="font-ui text-[11px] text-muted">comparable</span>
              </dd>
              <dd className="mt-1.5 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
                Basic lived-development outcomes, scored on normalised rates of improvement
                rather than against a counterfactual. Counted in the {total}, and broken out here
                so the method behind them is not mistaken for the rest.
              </dd>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:mt-[3.25rem]">
            <figure>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-surface">
                <img
                  key={hero.src}
                  src={`${import.meta.env.BASE_URL}${hero.src}`}
                  alt={hero.alt}
                  width={1600} height={900} loading="eager"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget.parentElement as HTMLElement)
                    .setAttribute("data-empty", "true"); e.currentTarget.style.display = "none"; }}
                />
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center
                                bg-[repeating-linear-gradient(45deg,#F3F1EC_0_12px,#FBFAF7_12px_24px)]
                                [figure_div[data-empty='true']_&]:flex">
                  <p className="px-6 text-center font-ui text-xs text-muted">
                    Drop the photograph at <code className="num">public/{hero.src}</code>
                  </p>
                </div>
              </div>
              <figcaption className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
                {hero.caption}
              </figcaption>
            </figure>
              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
                {[
                  ["Indicators", String(total)],
                  ["With a counterfactual", String(data.tier1.length)],
                  ["Significant at p ≤ 0.10", String(sig)],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <dt className="eyebrow min-h-[2.4em] leading-[1.2]">{k}</dt>
                    <dd className="num mt-auto pt-1 text-3xl text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-5 border-t border-border pt-5">
                <dt className="eyebrow">
                  {pov === "rahul" ? "Rahul is behind" : "Modi ahead on observed change"}
                </dt>
                <dd className="num mt-1 text-2xl text-modiInk">{modiAhead}/{total}</dd>
                <dd className="mt-1 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
                  A separate count, and a weaker one. Most of these compare India to its own past
                  rather than to an estimated alternative, and none is a significance test.
                </dd>
              </dl>
          </div>
        </div>
      </header>


      {/* ── Four possible Indias ─────────────────────────────────────────── */}
      <section className="bg-surface/40" aria-labelledby="whole">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 flex flex-wrap items-start justify-between gap-6">
           <div className="max-w-reading">
            <p className="eyebrow mb-4">The comparison · 2014 – {data.quadrant.economy.end}</p>
            <h2 id="whole" className="max-w-[20ch] font-display text-3xl leading-[1.15]
                                      tracking-tight sm:text-4xl">
              {verdict.lead}{" "}
              <span className={`italic ${pov === "rahul" ? "text-rahulInk" : "text-modiInk"}`}>
                {verdict.eco}
              </span>{" "}
              and{" "}
              <span className={`italic ${pov === "rahul" ? "text-rahulInk" : "text-modiInk"}`}>
                {verdict.sec}
              </span>
            </h2>
            <p className="mt-4 font-ui text-sm leading-relaxed text-muted">
              Two questions: richer, and safer? Both axes are the same single comparison read
              from one side. {otherSubject} sits at the centre as the reference point, and{" "}
              {subject} at its offset — up means richer, right means safer. Switching
              perspective in the header swaps which is which; the underlying numbers do not
              change.
            </p>
           </div>
           <div className="flex shrink-0 flex-col items-stretch">
           <Link to={pov === "rahul" ? "/read" : "/modi"}
             className="group mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border
                        border-rahul/40 bg-surface px-5 py-2.5 font-ui text-sm font-semibold
                        text-rahulInk shadow-card transition-all duration-300 ease-out
                        hover:-translate-y-0.5 hover:border-rahul hover:shadow-[0_10px_24px_-10px_rgba(20,69,124,.3)]">
             Read
             <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
           </Link>
           <Link to={pov === "rahul" ? "/modi" : "/read"}
             className="group mt-3 inline-flex shrink-0 items-center gap-2 rounded-full border
                        border-modi/40 bg-surface px-5 py-2.5 font-ui text-sm font-semibold
                        text-modiInk shadow-card transition-all duration-300 ease-out
                        hover:-translate-y-0.5 hover:border-modi hover:shadow-[0_10px_24px_-10px_rgba(210,105,30,.32)]">
             {otherSubject}
             <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
           </Link>
           </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <Quadrant data={data.quadrant} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <SecurityRadar />
            </div>
          </div>


          <div className="mt-14 border-t border-border pt-8">
            <p className="eyebrow mb-5">
              Twenty years of India&rsquo;s own direction · {data.composite.n} indicators, 2004 = 100
            </p>
            <dl className="grid gap-6 sm:grid-cols-4">
              {["Economy & society", "Health", "Security"].map((d) => {
                const m = data.composite.medians[d];
                const at = (y: number) => m.find((p) => p.year === y)?.v ?? 0;
                const last = m[m.length - 1].v;
                return (
                  <div key={d}>
                    <dt className="eyebrow">{d}</dt>
                    <dd className="num mt-1 text-3xl text-ink">{Math.round(last)}</dd>
                    <dd className="mt-1 font-ui text-[11px] leading-relaxed text-muted">
                      <span className="num">+{Math.round(at(2013) - 100)}</span> to 2013, then{" "}
                      <span className="num">+{Math.round(last - at(2013))}</span>
                    </dd>
                  </div>
                );
              })}
              <div>
                <dt className="eyebrow">All {data.composite.n}</dt>
                <dd className="num mt-1 text-3xl text-ink">
                  {Math.round(data.composite.all[data.composite.all.length - 1].v)}
                </dd>
                <dd className="mt-1 font-ui text-[11px] leading-relaxed text-muted">
                  Median across every domain, oriented so higher is better. Economy and society is
                  the one domain gaining more after 2014 than before.
                </dd>
              </div>
            </dl>
          </div>

        </div>
      </section>



      {/* ── Carousels: every indicator, grouped by what the method can say ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24" aria-labelledby="all">
        <div className="mb-10 border-b border-border pb-5">
          <h2 id="all" className="max-w-[24ch] font-display text-3xl leading-[1.15]
                                   tracking-tight sm:text-4xl">
            What Modi era built: Comparison with previous era and Rahul&rsquo;s India
          </h2>
          <p className="mt-2 max-w-reading font-ui text-sm text-muted">
            The {every.length} national indicators, grouped by what an estimated alternative
            can establish — {data.tier1.length} measured against a counterfactual,{" "}
            {data.tier2.length} estimated but not interpretable, and{" "}
            {untestable.length} on observed change alone. Where the data cannot support a
            counterfactual, the card says so rather than being left out. The other{" "}
            {everyday.counts.total} of the {total} are the Everyday India measures, below.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-ui text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-modi" aria-hidden="true" />
              Modi ahead on <span className="num text-modiInk">{modiAhead}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-rahul" aria-hidden="true" />
              Rahul ahead on <span className="num text-rahulInk">{rahulAhead}</span>
            </span>
            <span>
              of which <span className="num">{sig}</span> reach statistical significance
            </span>
          </p>


        </div>

        <div className="space-y-16">
          {[
            {
              key: "measured",
              n: 1,
              title: "Measured",
              blurb: "Pre-2014 fit under 15%. Counterfactual estimated and placebo-tested.",
              items: ordered.filter((i) => i.tier === 1),
              render: (i: typeof ordered[number]) => <Card item={i} />,
            },
            {
              key: "not-interpretable",
              n: 2,
              title: "Estimated, not interpretable",
              blurb: "The method could not reproduce India's own pre-2014 path. The verdict is shown, but rests on a counterfactual that does not fit.",
              items: ordered.filter((i) => i.tier === 2),
              render: (i: typeof ordered[number]) => <Card item={i} />,
            },
          ].map((g) => (
            <div key={g.key}>
              <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl">
                  <span className="num mr-3 text-base text-muted">{g.n}</span>{g.title}
                  <span className="num ml-3 text-base font-normal text-muted">
                    {g.items.length}
                  </span>
                </h3>
                <p className="max-w-reading font-ui text-xs leading-relaxed text-muted">{g.blurb}</p>
              </div>
              <Carousel items={g.items} keyOf={(i) => i.id} label={g.title} render={g.render} />
            </div>
          ))}

          {/* Thirty-six cards in one rail meant scrolling past twenty unrelated
              indicators to reach a given one. Split by what the measure is:
              capacity the state builds, and outcomes households live with. */}
          {[
            {
              key: "built", n: 3, title: "What was built",
              blurb: "Physical stock and industrial capacity — road, rail, port, metro and waterway " +
                     "networks, generating capacity, and manufacturing and defence output. No usable " +
                     "cross-country series exists for these, so the verdict compares observed Indian " +
                     "figures from 2014 to the latest available year.",
              items: built,
            },
            {
              key: "households", n: 4, title: "What households got",
              blurb: "Outcomes people live with — bank accounts, sanitation, poverty, schooling, " +
                     "health. Some have no comparator series at all; a few have one that is an " +
                     "interpolated trend and cannot carry a counterfactual. Either way the verdict " +
                     "is observed change, a weaker basis than an estimate.",
              items: households,
            },
          ].map((g) => (
            <div key={g.key}>
              <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl">
                  <span className="num mr-3 text-base text-muted">{g.n}</span>{g.title}
                  <span className="num ml-3 text-base font-normal text-muted">
                    {g.items.length}
                  </span>
                </h3>
                <p className="max-w-reading font-ui text-xs leading-relaxed text-muted">{g.blurb}</p>
              </div>
              <Carousel items={g.items} keyOf={(u) => u.id} label={g.title}
                render={(u) => <ObservedCard item={u} />} />
            </div>
          ))}

          <div>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-2xl">
                <span className="num mr-3 text-base text-muted">5</span>Internal security
                <span className="num ml-3 text-base font-normal text-muted">
                  {untestable.filter((u) => u.set === "security").length}
                </span>
              </h3>
              <p className="max-w-reading font-ui text-xs leading-relaxed text-muted">
                Jammu &amp; Kashmir, left-wing extremism and the Northeast, from Home Ministry
                reporting with annual fatality series from SATP. Every parameter improved. No
                comparator country publishes an equivalent series, so none of it can be tested
                against a counterfactual — and several of these declines were already under way
                before 2014.
              </p>
            </div>
            <Carousel items={untestable.filter((u) => u.set === "security")} keyOf={(u) => u.id}
              label="Internal security" render={(u) => <ObservedCard item={u} />} />
          </div>
        </div>
      </section>

      {/* ── supplementary layer, counted separately ─────────────── */}
      <section className="border-t border-border bg-surface/40" aria-labelledby="everyday">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-6">
              <p className="eyebrow mb-4">{everyday.label}</p>
              <h2 id="everyday" className="font-display text-3xl tracking-tight sm:text-4xl">
                And underneath the national numbers: {everyday.title}
              </h2>
              <p className="mt-2 font-display text-xl italic text-muted">{everyday.subtitle}</p>
              <p className="mt-5 max-w-reading font-ui text-sm leading-relaxed text-muted">
                {everyday.counts.total} additional measures of lived development — health coverage,
                maternal care, vaccination, nutrition and social outcomes that can affect millions
                of people but rarely dominate political debate in wealthy societies. Counted
                alongside the {every.length} national indicators, and scored a different way
                because the two answer different questions.
              </p>
              <Link to="/everyday"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border
                           border-modi/40 bg-surface px-5 py-2.5 font-ui text-sm font-semibold
                           text-modiInk shadow-card transition-all duration-300 ease-out
                           hover:-translate-y-0.5 hover:border-modi">
                Explore Everyday India
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
            <dl className="min-w-0 space-y-4 lg:col-span-6">
              {[[everyday.counts.later, "Modi-era leads", "text-modiInk", "border-modi/30 bg-modi/[0.06]"],
                [everyday.counts.earlier, "Earlier-era leads", "text-rahulInk", "border-rahul/30 bg-rahul/[0.06]"],
                [everyday.counts.comparable, "Broadly comparable", "text-muted", "border-border bg-border/15"],
              ].map(([n, label, tone, box]) => (
                <div key={label as string}
                     className={`flex items-baseline gap-5 rounded-lg border p-5 ${box}`}>
                  <dt className={`num text-4xl ${tone}`}>{n as number}</dt>
                  <dd className="font-ui text-sm text-ink">{label as string}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <WhyThisExists />

      <ThreeStages />

      <Fairness />



    </>
  );
}
