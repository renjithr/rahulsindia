import { Link } from "react-router-dom";
import { data } from "../lib/data";
import { everyday } from "../lib/everyday";

/** The dimensions this project measures, against those that dominate coverage. */
const OFTEN_COVERED = [
  "democracy", "religious tensions", "minority rights", "press freedom",
  "institutional independence", "nationalism", "political polarization",
];

const MEASURED_HERE = [
  ["Infrastructure", ["roads and highways", "railways", "airports", "urban development", "border infrastructure", "logistics"]],
  ["State capacity", ["public-service delivery", "welfare delivery", "formalization of the economy", "healthcare capacity"]],
  ["Digital", ["digital public infrastructure", "digital payments", "banking access", "financial inclusion"]],
  ["Security", ["internal security", "terrorism and major attacks", "defence capability", "defence exports"]],
  ["Basic services", ["electricity access", "sanitation", "drinking water", "housing"]],
  ["Economy", ["manufacturing", "economic scale", "exports", "investment"]],
] as const;

export function WhyThisExists() {
  return (
    <section className="border-t border-border" aria-labelledby="why">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="eyebrow mb-4">Why this project exists</p>
        <h2 id="why" className="max-w-[22ch] font-display text-3xl tracking-tight sm:text-4xl">
          The part of India&rsquo;s story that often gets missed
        </h2>

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <p className="max-w-reading font-body text-lg leading-relaxed text-muted">
              Much international discussion of India since 2014 has concentrated on democracy,
              religious tensions, minority rights, press freedom, institutional independence and
              political polarization.
            </p>
            <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
              These are legitimate areas of scrutiny. They are not the entirety of a country&rsquo;s
              performance. A government also shapes, directly or indirectly, the things below —
              and these dimensions often receive less attention in international political
              coverage of India.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {OFTEN_COVERED.map((t) => (
                <li key={t} className="rounded-full border border-border px-3 py-1
                                       font-ui text-[11px] text-muted">{t}</li>
              ))}
            </ul>
            <p className="mt-3 font-ui text-[11px] text-muted">
              Frequently covered. Not measured here — and not dismissed.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {MEASURED_HERE.map(([head, items]) => (
                <div key={head} className="border-t border-border pt-4">
                  <dt className="eyebrow">{head}</dt>
                  <dd className="mt-2 font-ui text-[13px] leading-relaxed text-ink">
                    {items.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-reading font-ui text-sm leading-relaxed text-muted">
              This project examines that measurable side of India&rsquo;s post-2014 change across{" "}
              <span className="num text-ink">
                {data.tier1.length + data.tier2.length + data.untestable.length}
              </span>{" "}
              indicators. The objective is not to argue that political or institutional concerns
              should be ignored. It is to ask whether focusing predominantly on those concerns
              produces an incomplete picture of how India changed after 2014.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The three questions the site works through, in order. */
export function ThreeStages() {
  const stages = [
    { n: "Stage 1", q: "What happened?",
      h: "India changed",
      b: "Measure the actual post-2014 record — infrastructure built, digital systems scaled, security incidents counted, services delivered. Description before interpretation." },
    { n: "Stage 2", q: "Would it have happened anyway?",
      h: "The obvious objection",
      b: "India was already developing before 2014. Set the post-2014 record against the earlier trajectory, and against countries that shared that trajectory. This is where most claims on both sides fall down." },
    { n: "Stage 3", q: "How much was a genuine break?",
      h: "Rahul's India",
      b: "Estimate the alternative: Rahul Gandhi becomes Prime Minister in 2014 and the broad UPA-era trajectory continues. Compare the India we got against that benchmark." },
  ];
  return (
    <section className="border-t border-border bg-surface/40" aria-labelledby="stages">
      <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="eyebrow mb-4">How the comparison is built</p>
      <h2 id="stages" className="max-w-[24ch] font-display text-3xl tracking-tight sm:text-4xl">
        Is the usual story about India complete?
      </h2>
      <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
        Countries are multidimensional. Asking what happened to infrastructure, security, the
        economy and state capacity is a different question from asking about institutions — and
        it needs a benchmark, or every improvement looks like an achievement. The site works
        through three stages.
      </p>

      <ol className="mt-12 grid gap-8 lg:grid-cols-3">
        {stages.map((s, i) => (
          <li key={s.n} className="border-t-2 border-ink/15 pt-5">
            <p className="eyebrow">{s.n}</p>
            <h3 className="mt-2 font-display text-2xl">{s.h}</h3>
            <p className="mt-1 font-ui text-[13px] font-semibold text-rahulInk">{s.q}</p>
            <p className="mt-3 font-ui text-[13px] leading-relaxed text-muted">{s.b}</p>
            {i === 2 && (
              <Link to="/read" className="mt-4 inline-flex items-center gap-1.5 font-ui text-[13px]
                                          text-rahulInk transition-colors hover:text-rahul">
                How the estimate is built →
              </Link>
            )}
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}

/** The rules, stated up front rather than defended later. */
export function Fairness() {
  const t1 = data.tier1;
  const notSig = t1.filter((x) => x.p !== null && x.p > 0.1).length;
  const rahulAhead = [...t1, ...data.untestable].filter((x) => x.verdictSide === "rahul").length
    + everyday.counts.earlier;
  return (
    <section className="border-t border-border bg-surface/40" aria-labelledby="fair">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="eyebrow mb-4">A thesis — but not a predetermined result</p>
        <h2 id="fair" className="max-w-[26ch] font-display text-3xl tracking-tight sm:text-4xl">
          The same rules apply whether a result helps or hurts
        </h2>
        <p className="mt-5 max-w-reading font-body text-lg leading-relaxed text-muted">
          This project began from the observation that important parts of India&rsquo;s post-2014
          development receive relatively little attention in many international political
          narratives. That is the motivation for the analysis. It is not a licence to manipulate
          the answer.
        </p>
        <p className="mt-4 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Indicators stay on the site when the result is inconvenient. As it stands:
        </p>

        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [String(rahulAhead), "indicators where Rahul's India performs better", "kept, not dropped"],
            [String(notSig), `of ${t1.length} measured results are not statistically significant`, "shown with their p-values"],
            [String(data.untestable.length), "indicators have no counterfactual at all", "no comparator country reports them"],
            [String(data.tier2.length), "were fitted too poorly to interpret", "labelled as such, not quietly used"],
          ].map(([n, what, sub]) => (
            <div key={what} className="border-t border-border pt-4">
              <dt className="num text-3xl text-ink">{n}</dt>
              <dd className="mt-2 font-ui text-[13px] leading-relaxed text-ink">{what}</dd>
              <dd className="mt-1 font-ui text-[11px] text-muted">{sub}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-reading font-ui text-sm leading-relaxed text-muted">
          The strongest argument this site can make is not that every number favours one side. It
          is that the method was fixed before the results were seen, and applied the same way to
          each. Observed improvement is also not the same thing as policy causation — a
          counterfactual can show that India moved differently from comparable countries, not why.
        </p>
      </div>
    </section>
  );
}
