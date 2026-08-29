import { data } from "../lib/data";
import { COUNTRY } from "../lib/data";

/**
 * The four tests that decide whether the wealth figure holds. Three pass.
 * One does not, and it is reported at the same weight as the others.
 */
export function Robustness() {
  const r = data.robustness;
  const loo = r.leaveOneOut;
  const lo = Math.min(...loo.map((l) => l.gap));
  const hi = Math.max(...loo.map((l) => l.gap));

  const tests = [
    {
      n: "In-time placebo",
      q: "Does a fake break produce the same gap?",
      verdict: "passes, with a caveat",
      ok: true,
      body: `Setting the treatment to 2009 and cutting the sample at 2013 gives a gap of
             ${r.placebo2009.gap > 0 ? "+" : ""}${r.placebo2009.gap}% after four years. The real
             2014 break gives ${r.placebo2009.realGapSameHorizon > 0 ? "+" : ""}${r.placebo2009.realGapSameHorizon}%
             over the same horizon — about twice as large. So 2014 is not purely trend, but a
             placebo year still produces roughly half the effect.`,
    },
    {
      n: "Leave-one-donor-out",
      q: "Is it driven by a single country?",
      verdict: "passes",
      ok: true,
      body: `Dropping each weighted donor in turn moves the gap between ${lo > 0 ? "+" : ""}${lo}%
             and ${hi > 0 ? "+" : ""}${hi}%. It never changes sign. The largest single
             dependency is ${COUNTRY[loo[0].dropped] ?? loo[0].dropped}, whose removal takes it
             to ${loo[0].gap > 0 ? "+" : ""}${loo[0].gap}%.`,
    },
    {
      n: "Oil-importer-only pool",
      q: "Is it terms of trade?",
      verdict: "passes",
      ok: true,
      body: `Excluding the ${r.oilImporterPool.excluded.length} net fuel exporters
             (${r.oilImporterPool.excluded.join(", ")}) leaves ${r.oilImporterPool.donors} donors
             and a gap of ${r.oilImporterPool.gap > 0 ? "+" : ""}${r.oilImporterPool.gap}% —
             unchanged from the baseline. The commodity-cycle objection does not explain it.`,
    },
    {
      n: "Alternate source and pool",
      q: "Does it survive a different GDP series?",
      verdict: "fails",
      ok: false,
      body: `Run on Penn World Table 11.0 instead of WDI, over the ${r.altSourcePWT.poolSize}-country
             pool from the Grier & Grier paper, the gap is ${r.altSourcePWT.samePoolPWT}% — the
             opposite sign. Holding that pool fixed and switching only the source gives
             ${r.altSourcePWT.samePoolWDI}% on WDI, so both the narrower pool and the source
             move it. The +${r.baseline.gap}% headline depends on the wide
             ${r.baseline.donors}-donor WDI pool.`,
    },
  ];

  return (
    <div>
      <ul className="divide-y divide-border border-y border-border">
        {tests.map((t) => (
          <li key={t.n} className="py-5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-xl">{t.n}</h3>
              <span className={`rounded-full border px-2 py-0.5 font-ui text-[10px] font-semibold
                                uppercase tracking-wider ${
                t.ok ? "border-modi/35 bg-modi/10 text-modiInk"
                     : "border-accent/40 bg-accent/[0.06] text-accent"}`}>
                {t.verdict}
              </span>
              <span className="font-ui text-[11px] text-muted">{t.q}</span>
            </div>
            <p className="mt-2 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
              {t.body}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-reading rounded-md border-l-2 border-accent bg-accent/[0.04]
                    px-4 py-3 font-ui text-[13px] leading-relaxed text-muted">
        <strong className="font-semibold text-ink">Three of four hold; the fourth does not.</strong>{" "}
        The wealth gap is not an artefact of one donor or of the commodity cycle, and it is larger
        than a placebo break produces. But it does not survive being re-run on a different income
        series over a narrower pool, where it turns negative. That is the strongest objection to
        the {r.baseline.gap}% figure, and it comes from our own test rather than from a critic.
      </p>
    </div>
  );
}
