import { data } from "../lib/data";

/**
 * The same seven parameters under two baselines.
 *
 * Conflict data is lumpy, so decade totals are the right unit — but which
 * decade you compare against decides the answer, and the two views disagree
 * by theatre rather than uniformly. That disagreement is the finding.
 */
export function SecurityDecade() {
  const d = data.securityDecade;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border">
              <th className="py-2 pr-4 font-ui text-[11px] uppercase tracking-wider text-muted">
                Parameter
              </th>
              <th className="py-2 pr-4 text-right font-ui text-[11px] uppercase tracking-wider text-muted">
                vs 2004–2013<br /><span className="normal-case tracking-normal">decade total</span>
              </th>
              <th className="py-2 text-right font-ui text-[11px] uppercase tracking-wider text-muted">
                vs 2011–2013<br /><span className="normal-case tracking-normal">annual average</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r) => (
              <tr key={r.label} className="border-b border-border">
                <td className="py-2.5 pr-4 font-ui text-[13px]">{r.label}</td>
                <td className="num py-2.5 pr-4 text-right text-sm text-modiInk">
                  {r.decade.toFixed(0)}%
                </td>
                <td className={`num py-2.5 text-right text-sm ${
                  r.recent < 0 ? "text-modiInk" : "text-accent"}`}>
                  {r.recent > 0 ? "+" : ""}{r.recent.toFixed(0)}%
                </td>
              </tr>
            ))}
            <tr className="border-b-2 border-ink/20">
              <td className="py-2.5 pr-4 font-ui text-[13px] font-semibold">Mean</td>
              <td className="num py-2.5 pr-4 text-right text-sm font-semibold text-modiInk">
                {d.decadeMean.toFixed(0)}%
              </td>
              <td className="num py-2.5 text-right text-sm font-semibold">
                {d.recentMean > 0 ? "+" : ""}{d.recentMean.toFixed(0)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="eyebrow mb-2">Left-wing extremism and the Northeast</p>
          <p className="font-ui text-[13px] leading-relaxed text-muted">
            Improve on both views. LWE civilian deaths are down 62% on the decade and still down
            54% against the 2011–2013 average; Northeast security-force deaths down 71% and 36%.
            These are sustained declines that do not depend on which baseline you pick.
          </p>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/[0.04] p-4">
          <p className="eyebrow mb-2">Jammu &amp; Kashmir</p>
          <p className="font-ui text-[13px] leading-relaxed text-muted">
            Splits. Down 60% on the decade, but J&amp;K violence was already at a historic low by
            2011–2013 — 158 deaths a year. Against that baseline the post-2014 average of 257 is
            <span className="text-accent"> 63% higher</span>. Civilian deaths +48%, security-force
            deaths +66%.
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
        Both views are defensible and they answer different questions. Against the full previous
        decade every parameter improves, by {Math.abs(d.decadeMean).toFixed(0)}% on average — that
        window contains the mid-2000s peak. Against the three years immediately before 2014 the
        average is {d.recentMean.toFixed(0)}%, because the two insurgencies kept falling while
        Kashmir turned back up. The aggregate figure is the sum of movements in opposite
        directions, which is also why the cross-country test comes back null: the theatres cancel.
      </p>
    </div>
  );
}
