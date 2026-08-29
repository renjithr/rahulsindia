import type { EverydayItem } from "../lib/everyday";

const BADGE: Record<EverydayItem["group"], { label: string; cls: string }> = {
  later:      { label: "Modi ahead",  cls: "border-modi/35 bg-modi/10 text-modiInk" },
  earlier:    { label: "Rahul leads", cls: "border-rahul/35 bg-rahul/10 text-rahulInk" },
  comparable: { label: "Comparable",  cls: "border-border bg-border/25 text-muted" },
};

/** One measure, both periods, with the normalised rates that decide it. */
export function EverydayCard({ item }: { item: EverydayItem }) {
  const b = BADGE[item.group];
  const mx = Math.max(item.normEarlier, item.normLater, 1);
  const bar = (v: number) => `${Math.max((Math.abs(v) / mx) * 100, 2)}%`;
  const reversal = item.leadType?.includes("reversal");

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className="eyebrow">{item.category}</span>
        <div className="flex flex-wrap gap-1.5">
          {reversal && (
            <span className="rounded-full border border-modi/35 bg-modi/[0.07] px-2 py-0.5
                             font-ui text-[9px] font-semibold uppercase tracking-wider text-modiInk">
              reversal
            </span>
          )}
          <span className={`rounded-full border px-2 py-0.5 font-ui text-[9px] font-semibold
                            uppercase tracking-wider ${b.cls}`}>{b.label}</span>
        </div>
      </div>

      <h3 className="font-display text-base leading-snug">{item.name}</h3>
      <p className="mt-1 font-ui text-[10px] uppercase tracking-wider text-muted">
        {item.higherIsBetter ? "higher is better" : "lower is better"}
      </p>

      <ol className="mt-4 flex items-baseline justify-between gap-2 border-y border-border py-3">
        {([["2005–06", item.v2005], ["2015–16", item.v2015], ["2023–24", item.v2023]] as const)
          .map(([y, v], i) => (
            <li key={y} className="flex-1">
              <p className="eyebrow">{y}</p>
              <p className={`num text-lg ${i === 2 ? "text-ink" : "text-muted"}`}>{v}%</p>
            </li>
          ))}
      </ol>

      <dl className="mt-4 space-y-2">
        {([["Earlier", item.normEarlier, "bg-rahul"], ["Later", item.normLater, "bg-modi"]] as const)
          .map(([k, v, col]) => (
            <div key={k} className="flex items-center gap-3">
              <dt className="w-14 shrink-0 font-ui text-[11px] text-muted">{k}</dt>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div className={`h-full rounded-full ${v < 0 ? "bg-accent/60" : col}`}
                     style={{ width: bar(v) }} />
              </div>
              <dd className={`num w-14 shrink-0 text-right text-xs
                              ${v < 0 ? "text-accent" : "text-ink"}`}>
                {v > 0 ? "+" : ""}{v.toFixed(2)}%
              </dd>
            </div>
          ))}
      </dl>
      <p className="mt-2 font-ui text-[10px] leading-relaxed text-muted">
        Normalised annual improvement. Raw change {item.rawEarlier > 0 ? "+" : ""}{item.rawEarlier}pp
        then {item.rawLater > 0 ? "+" : ""}{item.rawLater}pp.
      </p>
    </article>
  );
}
