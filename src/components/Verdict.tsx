import type { Indicator } from "../lib/types";
import { favours } from "../lib/format";

export type Side = "modi" | "rahul" | "none";

export function verdictOf(item: Indicator): Side {
  return item.verdictSide ?? (favours(item.gapPct, item.lowerIsBetter) ? "modi" : "rahul");
}

const STYLE: Record<Side, { label: string; cls: string; dot: string }> = {
  modi:  { label: "Modi ahead",  cls: "border-modi/35 bg-modi/10 text-modiInk",   dot: "bg-modi" },
  rahul: { label: "Rahul ahead", cls: "border-rahul/35 bg-rahul/10 text-rahulInk", dot: "bg-rahul" },
  none:  { label: "No data",     cls: "border-border bg-border/25 text-muted",     dot: "bg-muted" },
};

/** What the verdict is measured against — the two bases are not equivalent. */
export const BASIS_LABEL = {
  counterfactual: "vs synthetic counterfactual",
  observed: "2014 vs latest observed",
} as const;

/** Which side lands on the better face of the counterfactual. */
export function Verdict({
  side, size = "sm", showWhy,
}: { side: Side; size?: "sm" | "lg"; showWhy?: string }) {
  const s = STYLE[side];
  const pad = size === "lg" ? "px-3 py-1.5 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border
                  font-ui font-semibold uppercase tracking-wider ${pad} ${s.cls}`}
      title={showWhy}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

/** Chart legend with the verdict attached, so the reading is unambiguous. */
export function ChartKey({ side }: { side?: Side }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-ui text-[11px] text-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-5 bg-modi" aria-hidden="true" />
        Modi India · actual
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0 w-5 border-t-2 border-dashed border-rahul" aria-hidden="true" />
        Rahul India · synthetic
      </span>
      {side && <Verdict side={side} />}
    </div>
  );
}
