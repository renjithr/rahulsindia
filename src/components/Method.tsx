import type { Indicator } from "../lib/types";
import { COUNTRY } from "../lib/data";

/**
 * How this number was produced — written for a reader who has just looked at
 * the donor weights and wondered why Nepal is in an unemployment estimate.
 */
export function Method({ item }: { item: Indicator }) {
  const anchors = item.preWindow.split("-")[0];
  const top = item.donorNote;
  const nz = item.weights.length;

  const steps = [
    {
      n: 1, h: "Describe India before 2014",
      b: `India's ${item.title.toLowerCase()} is summarised over ${item.preWindow} — the value at
          five evenly spaced years starting ${anchors}, plus three background controls averaged
          across the whole window: GDP per capita, urbanisation and life expectancy.`,
    },
    {
      n: 2, h: "Find the blend that matches it",
      b: `Each of the ${item.donors} comparison countries is described the same way. An optimiser
          then searches for the weighted mix of them whose pre-2014 path sits closest to India's.
          Weights cannot be negative and must sum to 100%, so the result is always a real
          combination of real countries — never an extrapolation.`,
    },
    {
      n: 3, h: "Check the match is good enough",
      b: `The blend misses India's actual pre-2014 path by ${item.fit.toFixed(1)}% on average.
          ${item.fit < 15
            ? "That is close enough to treat the projection as meaningful."
            : "That is too loose to interpret — the post-2014 difference is not reported as an effect."}`,
    },
    {
      n: 4, h: "Project it forward and compare",
      b: `The weights are frozen and applied to ${item.postWindow}, years the optimiser never saw.
          That projection is Rahul's India. The difference against what actually happened is the
          gap shown above.`,
    },
    {
      n: 5, h: "Test it against the other countries",
      b: item.p === null
        ? "Not placebo-tested."
        : `The whole procedure is re-run pretending each comparison country was the one treated in
           2014. India's break ranks ${item.rank} against those placebos, giving p = ${item.p.toFixed(3)}${
             item.p <= 0.1 ? " — larger than chance would usually produce." :
             " — well within what chance produces, so this gap is not distinguishable from noise."}`,
    },
  ];

  return (
    <section className="border-t border-border py-14">
      <h2 className="font-display text-2xl">How this was calculated</h2>
      <p className="mb-8 mt-1 max-w-reading font-ui text-sm leading-relaxed text-muted">
        Nothing here is chosen by hand. The comparison countries are not picked for being like
        India — they are whatever mix best reproduces India&rsquo;s own path before 2014 on this
        particular measure.
      </p>

      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="border-t border-border pt-4">
            <p className="eyebrow">
              <span className="num mr-2">{s.n}</span>{s.h}
            </p>
            <p className="mt-2 font-ui text-[13px] leading-relaxed text-muted">{s.b}</p>
          </li>
        ))}
      </ol>

      {top && (
        <div className="mt-10 max-w-reading rounded-lg border border-border bg-surface p-5">
          <p className="eyebrow mb-2">Why {COUNTRY[top.country] ?? top.country}?</p>
          <p className="font-ui text-[13px] leading-relaxed text-muted">
            {COUNTRY[top.country] ?? top.country} carries{" "}
            <span className="num text-ink">{(top.here * 100).toFixed(0)}%</span> of the weight here
            — not because it resembles India economically or politically, but because its{" "}
            {item.title.toLowerCase()} moved like India&rsquo;s did between{" "}
            {item.preWindow.replace("-", " and ")}.
            {top.zeroOn > 0 && (
              <>
                {" "}On <span className="num text-ink">{top.zeroOn}</span> of the other{" "}
                {top.total} indicators on this site it carries no weight at all
                {top.best.length > 0 && (
                  <>
                    ; where it does appear, the largest is {top.best[0].title.toLowerCase()} at{" "}
                    <span className="num text-ink">{(top.best[0].w * 100).toFixed(0)}%</span>
                  </>
                )}.
              </>
            )}{" "}
            The blend is re-solved from scratch for every indicator, which is why the same country
            can dominate one estimate and be absent from the next.
          </p>
          <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
            {nz} of {item.donors} comparison countries carry any weight at all. The rest are
            assigned zero by the optimiser.
          </p>
        </div>
      )}
    </section>
  );
}
