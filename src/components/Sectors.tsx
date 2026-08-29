import { Link } from "react-router-dom";
import { data } from "../lib/data";
import { ThemeLine, ThemeBars, ThemeHeat } from "./ThemeCharts";
import { fmt } from "../lib/format";

/** Sector notes. Descriptive: what moved, over what period. */
export const NOTE: Record<number, string> = {
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

export type Side = "modi" | "rahul";

/**
 * One template, read from either side.
 *
 * The stored gap is Modi's India against Rahul's, so the mirror is not a sign
 * flip: it is the same ratio taken from the other base. FDI at +210% from
 * Rahul's base is −68% from Modi's, not −210%. Every figure on the Rahul side
 * is recomputed against `modi` for that reason.
 */
export function gapFrom(side: Side, it: { gap: number; rahul: number; modi: number }) {
  return side === "modi" ? it.gap : ((it.rahul - it.modi) / it.modi) * 100;
}

export function Sectors({ side, startAt = 2 }: { side: Side; startAt?: number }) {
  const modiSide = side === "modi";
  const ink = modiSide ? "text-modiInk" : "text-rahulInk";
  const hover = modiSide ? "hover:text-modiInk" : "hover:text-rahulInk";

  return (
    <>
      {data.modiPage.themes.map((t, ti) => (
        <section key={t.theme} className="border-b border-border py-14">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="eyebrow">0{ti + startAt} — sector</p>
            <h2 className="font-display text-3xl">{t.theme}</h2>
            <p className="max-w-reading font-ui text-[13px] text-muted">{t.why}</p>
          </div>

          <ThemeHeat items={t.items} side={side} />

          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
            {t.items.map((it) => {
              const g = gapFrom(side, it);
              return (
                <figure key={it.id} className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4">
                    <Link to={`/indicator/${it.id}`}
                      className={`font-display text-lg transition-colors duration-300 ${hover}`}>
                      {it.title}
                    </Link>
                    <span className={`num text-lg ${ink}`}>
                      {g > 0 ? "+" : ""}{g.toFixed(0)}%
                    </span>
                  </div>
                  <p className="mb-4 font-ui text-[11px] text-muted">
                    {it.unit} ·{" "}
                    {modiSide
                      ? <>{fmt(it.rahul, it.unit)} → {fmt(it.modi, it.unit)}</>
                      : <>{fmt(it.modi, it.unit)} actual → {fmt(it.rahul, it.unit)} estimated</>}
                  </p>
                  {t.chart === "bars" ? <ThemeBars item={it} /> : <ThemeLine item={it} />}
                  <figcaption className="mt-3 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
                    {NOTE[it.id]}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
