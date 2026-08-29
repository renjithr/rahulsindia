/** Compact, unit-aware number formatting for editorial display. */
export function fmt(v: number | null | undefined, unit = ""): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const a = Math.abs(v);
  if (unit === "USD") {
    if (a >= 1e12) return `$${(v / 1e12).toFixed(2)}tn`;
    if (a >= 1e9) return `$${(v / 1e9).toFixed(1)}bn`;
    if (a >= 1e6) return `$${(v / 1e6).toFixed(0)}m`;
    return `$${v.toFixed(0)}`;
  }
  if (a >= 1e9) return `${(v / 1e9).toFixed(1)}bn`;
  if (a >= 1e6) return `${(v / 1e6).toFixed(1)}m`;
  if (a >= 1e4) return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (a >= 100) return v.toFixed(0);
  if (a >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

export const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`;

/** Did the actual path land on the better side of the counterfactual? */
export const favours = (gapPct: number, lowerIsBetter: boolean) =>
  lowerIsBetter ? gapPct < 0 : gapPct > 0;

export const pLabel = (p: number | null) =>
  p === null ? "not tested" : p <= 0.1 ? `p = ${p.toFixed(3)}` : `p = ${p.toFixed(2)}`;

/** The quadrant's headline claim, derived so heading and chart cannot drift. */
export function quadrantVerdict(q: {
  economy: { gapPct: number };
  security: { gapPct: number; null?: boolean };
}) {
  const eco = -q.economy.gapPct;   // Rahul's side
  const sec = q.security.gapPct;
  // A gap that fails its placebo test has no direction to report. Naming one
  // would dress up noise as a finding.
  const secNull = q.security.null === true;   // set false once a basis is chosen
  const ecoPhrase = `${Math.abs(eco).toFixed(0)}% ${eco > 0 ? "richer" : "poorer"}`;
  const secPhrase = secNull
    ? "no measurable difference in security"
    : `${Math.abs(sec).toFixed(0)}% ${sec > 0 ? "more secure" : "less secure"}`;
  return {
    eco, sec, secNull, ecoPhrase, secPhrase,
    ecoWord: eco > 0 ? "richer" : "poorer",
    secWord: secNull ? "no measurable difference" : sec > 0 ? "more secure" : "less secure",
    text: secNull
      ? `Rahul's India would have been ${ecoPhrase}, with no measurable difference in security`
      : `Rahul's India would have been ${ecoPhrase} and ${secPhrase}`,
  };
}
