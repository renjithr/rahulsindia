import type { Indicator, Untestable } from "../lib/types";
import { fmt } from "../lib/format";

/** One line on what the measure actually counts, for readers meeting it cold. */
const WHAT: Record<string, string> = {
  nom_gdp_usd: "the total value of everything India produces in a year, at current dollar prices",
  exports_gs_usd: "the dollar value of all goods and services India sells abroad in a year",
  services_exp_usd: "the dollar value of services India sells abroad — software, business processing, travel",
  fdi_in_usd: "money foreign companies put into Indian operations, net of what they pull out",
  reserves_usd: "the foreign currency and gold the Reserve Bank holds to defend the rupee",
  patents_resident: "patent applications filed in India by Indian residents, a rough proxy for domestic invention",
  rnd_pct_gdp: "how much of national income goes into research and development",
  air_departures: "take-offs by registered carriers, standing in for how much of the country aviation reaches",
  air_passengers: "passengers flown by registered carriers in a year",
  manuf_va_usd: "the value manufacturing adds to the economy, net of the inputs it consumes",
  mil_exp_usd: "total government spending on defence",
  imr: "deaths before a first birthday, per 1,000 live births",
  nmr: "deaths in the first 28 days of life, per 1,000 live births",
  u5mr: "deaths before a fifth birthday, per 1,000 live births",
  maternal_mortality: "women dying from causes related to pregnancy or childbirth, per 100,000 live births",
  oop_health_pct: "the share of all health spending that households pay directly at the point of care, rather than through insurance or the state",
  catastrophic_health_pct: "the share of people spending more than a tenth of the household budget on health in a year",
  undernourishment: "the share of the population not getting enough calories to meet dietary energy needs",
  life_expectancy: "how long a child born this year could expect to live at current mortality rates",
  clean_cook_pct: "the share of households cooking with gas or electricity rather than wood, dung or coal",
  open_defec_pct: "the share of the population without access to any toilet",
  sanit_basic_pct: "the share of the population with a toilet not shared with other households",
  water_safe: "the share of people with drinking water on the premises, available when needed and free of contamination",
  electricity_access: "the share of the population connected to electricity",
  unemployment: "the share of the labour force without work and looking for it, on modelled international estimates",
  female_lfp: "the share of women aged 15 and over who are working or looking for work",
  co2_pc: "carbon dioxide emitted per person per year",
};

function dirWords(lowerIsBetter: boolean) {
  return lowerIsBetter
    ? { good: "fell", bad: "rose", better: "lower", worse: "higher" }
    : { good: "rose", bad: "fell", better: "higher", worse: "lower" };
}

/** Plain-language reading of a measured indicator, between the score and the chart. */
export function Explain({ item }: { item: Indicator }) {
  const w = dirWords(item.lowerIsBetter);
  const end = Number(item.postWindow.split("-")[1]);
  const base = item.congress2013;
  const moved = base !== null && base !== undefined
    ? (item.modi > base ? "risen" : item.modi < base ? "fallen" : "held flat")
    : null;
  const better = item.lowerIsBetter ? item.modi < item.rahul : item.modi > item.rahul;
  const what = WHAT[item.variable];

  return (
    <section className="border-b border-border py-10">
      <p className="eyebrow mb-3">What this measures</p>
      <div className="max-w-reading space-y-4 font-body text-lg leading-relaxed">
        <p>
          {item.title} is {what ?? `measured in ${item.unit}`}.{" "}
          {item.lowerIsBetter
            ? "A falling number is an improvement."
            : "A rising number is an improvement."}
        </p>

        <p>
          {base !== null && base !== undefined && (
            <>India stood at <span className="num">{fmt(base, item.unit)}</span> in 2013, before
            the two paths separate. By {end} Modi&rsquo;s current India had {moved} to </>
          )}
          {(base === null || base === undefined) && <>By {end} Modi&rsquo;s current India stood at </>}
          <span className="num text-modiInk">{fmt(item.modi, item.unit)}</span>, while Rahul&rsquo;s
          India — the blend of comparison countries that tracked India before 2014 — reached{" "}
          <span className="num text-rahulInk">{fmt(item.rahul, item.unit)}</span>.
        </p>

        <p>
          That leaves Modi&rsquo;s current India{" "}
          <span className={`num ${better ? "text-modiInk" : "text-rahulInk"}`}>
            {Math.abs(item.gapPct).toFixed(0)}%
          </span>{" "}
          {better ? w.better : w.worse} than Rahul&rsquo;s India — {better ? "better" : "worse"} than
          where comparable economies ended up.{" "}
          {item.tier === 2 ? (
            <>But Rahul&rsquo;s India missed India&rsquo;s own pre-2014 path by{" "}
            {item.fit.toFixed(1)}%, so this difference should not be read as an effect.</>
          ) : item.significant ? (
            <>Modi&rsquo;s current India ranks {item.rank} against placebo countries
            (p = {item.p?.toFixed(3)}), so the gap is larger than chance usually produces.</>
          ) : (
            <>Modi&rsquo;s current India ranks {item.rank} against placebo countries
            (p = {item.p?.toFixed(3)}) — within the range chance produces, so the gap is not
            distinguishable from noise.</>
          )}
        </p>
      </div>
    </section>
  );
}

/** Same idea for indicators with no counterfactual: observed change only. */
export function ExplainObserved({ item }: { item: Untestable }) {
  const c = item.observedChange;
  const improved = c ? (item.lowerIsBetter ? c.changePct !== null && c.changePct < 0
                                           : c.changePct !== null && c.changePct > 0) : false;

  return (
    <section className="border-b border-border py-10">
      <p className="eyebrow mb-3">What this measures</p>
      <div className="max-w-reading space-y-4 font-body text-lg leading-relaxed">
        <p>
          {item.title}, in {item.unit}.{" "}
          {item.lowerIsBetter ? "A falling number is an improvement." : "A rising number is an improvement."}
          {item.sourceFamily ? <> Reported by {item.sourceFamily}.</> : null}
        </p>
        {c && c.base !== null && c.latest !== null ? (
          <p>
            It stood at <span className="num">{fmt(c.base)}</span> in {c.baseYear}, and under
            Modi&rsquo;s current India reached{" "}
            <span className="num text-modiInk">{fmt(c.latest)}</span> by {c.latestYear} —{" "}
            {c.changePct === null ? "a change" : <>{c.changePct > 0 ? "a rise" : "a fall"} of{" "}
            <span className={`num ${improved ? "text-modiInk" : "text-rahulInk"}`}>
              {Math.abs(c.changePct).toFixed(0)}%
            </span></>}. That is {improved ? "an improvement" : "a deterioration"} against India&rsquo;s
            pre-2014 figure.
          </p>
        ) : (
          <p>No comparable pair of observations is available for this measure.</p>
        )}
        <p className="text-muted">
          {item.basis === "peers"
            ? "Comparable countries report this, but the series starts too late to build Rahul's India, so Modi's current India is placed against those peers directly rather than against an estimate."
            : "No comparison country reports an equivalent series, so there is no Rahul's India to compare against. This is a before-and-after reading, not a treatment effect."}
        </p>
      </div>
    </section>
  );
}
