import type { Untestable } from "../lib/types";

/**
 * The basis for the quadrant's horizontal position, shown alongside it.
 *
 * Units differ by two orders of magnitude across these parameters, so each is
 * indexed to its own 2004-2014 decade total. The bar is what remained in
 * 2014-2024. This is the same arithmetic that produces the assumed security
 * gap — laid out so the assumption can be read rather than taken on trust.
 */
export function PrePost({ items }: { items: Untestable[] }) {
  const rows = items
    .flatMap((i) => {
      const c = i.observedChange;
      return c && c.changePct !== null ? [{ i, change: c.changePct, pct: 100 + c.changePct,
                                            base: c.base, latest: c.latest }] : [];
    })
    .sort((a, b) => a.pct - b.pct);
  const mean = rows.reduce((s, r) => s + r.pct, 0) / rows.length;

  return (
    <figure>
      <h3 className="font-display text-xl">Pre-2014 against post-2014</h3>
      <p className="mb-6 mt-1 font-ui text-[11px] leading-relaxed text-muted">
        Each parameter indexed to its own 2004–2014 decade total. The bar is what
        remained in 2014–2024.
      </p>

      <ul className="space-y-2.5">
        {rows.map(({ i, pct, change, base, latest }) => (
          <li key={i.id}>
            <a href={`#/indicator/${i.id}`} className="pointer-events-none block">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-ui text-[11px] text-ink">{i.title}</span>
                <span className="num shrink-0 text-[11px] text-modiInk">
                  {change.toFixed(0)}%
                </span>
              </div>
              <div className="relative mt-1 h-2.5 overflow-hidden rounded-sm bg-border/40">
                <div className="absolute inset-y-0 left-0 rounded-sm bg-modi/55
                                transition-all duration-700 ease-out"
                     style={{ width: `${Math.max(pct, 1)}%` }} />
              </div>
              <div className="mt-0.5 flex justify-between font-ui text-[9px] text-muted">
                <span className="num">{base?.toLocaleString() ?? "—"}</span>
                <span className="num">{latest?.toLocaleString() ?? "—"}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">Mean across {rows.length}</span>
          <span className="num text-lg text-modiInk">{(mean - 100).toFixed(1)}%</span>
        </div>
        <p className="mt-2 font-ui text-[10px] leading-relaxed text-muted">
          This mean is what places Rahul&rsquo;s India on the horizontal axis, under the
          assumption that the whole reduction is attributable to the post-2014 government.
        </p>
      </div>
    </figure>
  );
}
