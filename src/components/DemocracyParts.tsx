import { useMemo, useState, type ReactNode } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, BarChart, Bar, Cell, LabelList,
} from "recharts";
import {
  VERDICT, years, components, edi, pollingStations, partyParticipation,
  mediaTimeline, fcra, matrix, sources, sourceById, vvpat,
  type Verdict, type Indicator, type Section,
} from "../lib/democracy";

/* ── verdict badge ────────────────────────────────────────────────────── */

export function VerdictBadge({ v, size = "sm" }: { v: Verdict; size?: "sm" | "lg" }) {
  const m = VERDICT[v];
  return (
    <span
      title={m.description}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-ui font-semibold
                  ${size === "lg" ? "px-3.5 py-1.5 text-[12px]" : "px-2.5 py-1 text-[10.5px]"} ${m.tone}`}>
      {/* the glyph carries the meaning too — verdict never rests on colour alone */}
      <span aria-hidden="true" className="num text-[11px] leading-none opacity-70">{m.mark}</span>
      {m.label}
    </span>
  );
}

export function SourceChip({ id }: { id: string }) {
  const s = sourceById(id);
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-border bg-background
                     px-2 py-0.5 font-ui text-[10px] text-muted">
      <span className="font-semibold text-ink/70">{s.publisher}</span>
      <span className="opacity-60">·</span>
      <span>{s.type}</span>
    </span>
  );
}

/* ── hero score cards ─────────────────────────────────────────────────── */

export function ScoreHero() {
  const rows = [
    { label: "2010", v: 0.671, note: "before the comparison window" },
    { label: "2014", v: 0.617, note: "the baseline V-Dem scores higher" },
    { label: "2023", v: 0.374, note: "the score under audit" },
  ];
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {rows.map((r, i) => (
        <div key={r.label}
          className={`rounded-lg border p-5 ${i === 2 ? "border-accent/30 bg-accent/[0.04]" : "border-border bg-surface"}`}>
          <dt className="eyebrow">{r.label} · Electoral Democracy</dt>
          <dd className={`num mt-2 text-4xl ${i === 2 ? "text-accent" : "text-ink"}`}>{r.v.toFixed(3)}</dd>
          <dd className="mt-1.5 font-ui text-[11px] leading-relaxed text-muted">{r.note}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── 1. hero slope chart ──────────────────────────────────────────────── */

const SERIES = [
  { key: "electoralDemocracy", name: "Electoral Democracy", colour: "#8C2F2F", width: 2.6 },
  { key: "freedomExpression", name: "Expression", colour: "#D2691E", width: 1.7 },
  { key: "cleanElections", name: "Clean Elections", colour: "#1D5FA8", width: 1.7 },
  { key: "freedomAssociation", name: "Association", colour: "#6B675E", width: 1.7 },
  { key: "electedOfficials", name: "Elected Officials", colour: "#1A1A18", width: 1.2 },
  { key: "suffrage", name: "Suffrage", colour: "#9CA3AF", width: 1.2 },
] as const;

export function ComponentSlopeChart() {
  return (
    <figure className="min-w-0">
      <div style={{ height: 340 }}
        role="img"
        aria-label="Line chart of India's V-Dem Electoral Democracy score and its five components at 2010, 2014 and 2023. Elected Officials and Suffrage stay at 1.0 throughout. Expression falls from 0.889 to 0.812 to 0.422, Clean Elections from 0.709 to 0.673 to 0.485, Association from 0.787 to 0.769 to 0.597, and the overall index from 0.671 to 0.617 to 0.374.">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={years} margin={{ top: 10, right: 92, bottom: 4, left: -18 }}>
            <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="year" type="category" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
            <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]}
                   tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={false} width={52} />
            <ReferenceLine x={2014} stroke="#1A1A18" strokeDasharray="3 3" strokeOpacity={0.45}
              label={{ value: "comparison point", position: "top", fontSize: 10, fill: "#6B675E" }} />
            <Tooltip content={({ active, payload, label }: any) =>
              active && payload?.length ? (
                <div className="rounded-md border border-border bg-surface/95 px-3 py-2 shadow-card">
                  <div className="eyebrow mb-1.5">{label}</div>
                  {payload.map((p: any) => (
                    <div key={p.dataKey} className="flex items-center gap-4 font-ui text-xs">
                      <span className="text-muted">{SERIES.find((s) => s.key === p.dataKey)?.name}</span>
                      <span className="num ml-auto">{Number(p.value).toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              ) : null} />
            {SERIES.map((s) => (
              <Line key={s.key} type="linear" dataKey={s.key} stroke={s.colour} strokeWidth={s.width}
                    dot={{ r: 3, fill: s.colour, strokeWidth: 0 }} isAnimationActive={false}>
                <LabelList dataKey={s.key} position="right"
                  content={({ x, y, index }: any) =>
                    index === years.length - 1 ? (
                      <text x={Number(x) + 8} y={Number(y) + 4} fontSize={10} fill={s.colour}
                            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                        {s.name}
                      </text>
                    ) : null} />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-3 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
        Elected Officials and Suffrage sit at 1.0 across all three years and are drawn flat at the top.
        The entire decline is carried by the other three. Clean Elections is reconstructed from V-Dem's
        published formula, not read from the panel.
      </figcaption>
    </figure>
  );
}

/* ── 2. which components actually fell ────────────────────────────────── */

export function ComponentBreakdown() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {components.map((c) => (
        <li key={c.key}
          className={`rounded-lg border p-4 ${c.fell ? "border-accent/25 bg-accent/[0.03]" : "border-border bg-ink/[0.02]"}`}>
          <p className="font-ui text-[13px] font-semibold text-ink">
            {c.name}
            {"derived" in c && c.derived && (
              <span className="ml-1.5 align-middle font-normal text-[10px] text-muted">derived</span>
            )}
          </p>
          <p className="num mt-2 flex items-baseline gap-2 text-sm text-muted">
            <span>{c.v2010.toFixed(3)}</span><span className="opacity-40">→</span>
            <span>{c.v2014.toFixed(3)}</span><span className="opacity-40">→</span>
            <span className={c.fell ? "text-accent" : "text-ink"}>{c.v2023.toFixed(3)}</span>
          </p>
          <p className={`num mt-2 text-lg ${c.fell ? "text-accent" : "text-emerald-800"}`}>
            {c.change === 0 ? "no change" : c.change.toFixed(3)}
          </p>
          <p className="mt-0.5 font-ui text-[10.5px] text-muted">2014 → 2023</p>
        </li>
      ))}
    </ul>
  );
}

/* ── 3. the formula ──────────────────────────────────────────────────── */

export function IndexFormula() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="eyebrow mb-2">Additive half — API</p>
        <pre className="num overflow-x-auto text-[11.5px] leading-relaxed text-ink">{`0.25 × Association
0.25 × Clean Elections
0.25 × Expression
0.125 × Elected Officials
0.125 × Suffrage`}</pre>
        <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
          A weighted average. A fall in one component moves this in proportion to its weight.
        </p>
      </div>
      <div className="rounded-lg border border-accent/30 bg-accent/[0.04] p-5">
        <p className="eyebrow mb-2 text-accent">Multiplicative half — MPI</p>
        <pre className="num overflow-x-auto text-[11.5px] leading-relaxed text-ink">{`Association
  × Clean Elections
  × Expression
  × Elected Officials
  × Suffrage`}</pre>
        <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
          A product. Three components falling together do not add — they compound. This is V-Dem's
          deliberate “weakest link” design, not an accident.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="eyebrow mb-2">The index</p>
        <pre className="num overflow-x-auto text-[11.5px] leading-relaxed text-ink">{`EDI = 0.5 × API
    + 0.5 × MPI`}</pre>
        <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
          Half the headline number is therefore a product of five terms. That is what makes the
          post-2014 fall steeper than any single component's fall.
        </p>
      </div>
    </div>
  );
}

/* ── 4. weakest-link calculator ──────────────────────────────────────── */

const PRESETS = {
  "India 2010": { expression: 0.889, association: 0.787, clean: 0.708687, elected: 1, suffrage: 1 },
  "India 2014": { expression: 0.812, association: 0.769, clean: 0.673297, elected: 1, suffrage: 1 },
  "India 2023": { expression: 0.422, association: 0.597, clean: 0.484625, elected: 1, suffrage: 1 },
};

const SLIDERS = [
  { key: "expression", label: "Freedom of Expression" },
  { key: "association", label: "Freedom of Association" },
  { key: "clean", label: "Clean Elections" },
  { key: "elected", label: "Elected Officials" },
  { key: "suffrage", label: "Universal Suffrage" },
] as const;

export function WeakestLinkCalculator() {
  const [v, setV] = useState(PRESETS["India 2023"]);
  const [preset, setPreset] = useState("India 2023");
  const out = useMemo(() => edi(v), [v]);
  const base = edi(PRESETS["India 2014"]);

  const set = (k: keyof typeof v, n: number) => { setV({ ...v, [k]: n }); setPreset("custom"); };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <div className="mb-5 flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((p) => (
            <button key={p} type="button"
              onClick={() => { setV(PRESETS[p as keyof typeof PRESETS]); setPreset(p); }}
              aria-pressed={preset === p}
              className={`rounded-full border px-3.5 py-1.5 font-ui text-[12px] font-semibold
                          transition-all duration-300 ${
                preset === p ? "border-rahul bg-rahul/10 text-rahulInk"
                             : "border-border bg-surface text-muted hover:border-rahul/50"}`}>
              {p}
            </button>
          ))}
          {preset === "custom" && (
            <span className="self-center font-ui text-[11px] text-muted">custom values</span>
          )}
        </div>

        <ul className="space-y-4">
          {SLIDERS.map((s) => (
            <li key={s.key}>
              <label className="flex items-baseline justify-between gap-4">
                <span className="font-ui text-[13px] text-ink">{s.label}</span>
                <span className="num text-sm text-muted">{v[s.key].toFixed(3)}</span>
              </label>
              <input type="range" min={0} max={1} step={0.001} value={v[s.key]}
                aria-label={`${s.label}, currently ${v[s.key].toFixed(3)} of 1`}
                onChange={(e) => set(s.key, Number(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full
                           bg-border accent-rahul" />
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
          Set any component back to its 2014 value and watch the index move. Restoring Expression
          alone recovers far more than its additive weight would suggest, because it also sits inside
          the product.
        </p>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <dl className="space-y-3">
          {[
            ["Additive · API", out.api, base.api],
            ["Multiplicative · MPI", out.mpi, base.mpi],
          ].map(([label, val, ref]) => (
            <div key={label as string} className="rounded-lg border border-border bg-surface p-4">
              <dt className="eyebrow">{label as string}</dt>
              <dd className="num mt-1 text-2xl text-ink">{(val as number).toFixed(3)}</dd>
              <dd className="mt-0.5 font-ui text-[10.5px] text-muted">
                India 2014: <span className="num">{(ref as number).toFixed(3)}</span>
              </dd>
            </div>
          ))}
          <div className="rounded-lg border border-accent/30 bg-accent/[0.05] p-5">
            <dt className="eyebrow text-accent">Electoral Democracy Index</dt>
            <dd className="num mt-1 text-4xl text-accent">{out.edi.toFixed(3)}</dd>
            <dd className="mt-1 font-ui text-[10.5px] text-muted">
              India 2014: <span className="num">{base.edi.toFixed(3)}</span> ·
              published 2023: <span className="num">0.374</span>
            </dd>
          </div>
        </dl>
        <div className="mt-4 rounded-lg border border-border bg-background p-4">
          <p className="eyebrow mb-2">The product, worked through</p>
          <p className="num text-[11.5px] leading-relaxed text-muted">
            0.812 × 0.769 × 0.673 ≈ <span className="text-ink">0.420</span><br />
            0.422 × 0.597 × 0.485 ≈ <span className="text-accent">0.122</span>
          </p>
          <p className="mt-2 font-ui text-[10.5px] leading-relaxed text-muted">
            The three disputed components do not merely add together. For half the index they are
            multiplied, so the product falls by more than any of them individually.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. objective election-capacity charts ───────────────────────────── */

export function ElectionCapacityChart() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <figure className="min-w-0 rounded-lg border border-emerald-700/25 bg-emerald-600/[0.04] p-5">
        <p className="eyebrow mb-1">Polling stations administered</p>
        <p className="mb-4 font-ui text-[11px] text-muted">Election Commission of India</p>
        <div style={{ height: 190 }} role="img"
          aria-label="Bar chart: polling stations rose from 830,866 in 2009 to 927,553 in 2014 to 1,037,848 in 2019.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollingStations} margin={{ top: 6, right: 6, bottom: 0, left: -6 }}>
              <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="election" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                     tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                     tickLine={false} axisLine={false} width={56}
                     tickFormatter={(n) => `${Math.round(n / 1000)}k`} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {pollingStations.map((p) => (
                  <Cell key={p.election} fill={p.election === 2019 ? "#047857" : "#B8B2A6"} />
                ))}
                <LabelList dataKey="count" position="top" fontSize={10} fill="#6B675E"
                  formatter={(n) => Number(n).toLocaleString()} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <div className="min-w-0 rounded-lg border border-emerald-700/25 bg-emerald-600/[0.04] p-5">
        <p className="eyebrow mb-1">Voter-verified paper audit trail</p>
        <p className="mb-4 font-ui text-[11px] text-muted">Election Commission of India</p>
        <dl className="space-y-3">
          {([2009, 2014, 2019] as const).map((y) => (
            <div key={y} className="flex items-baseline gap-4 border-b border-border pb-2.5 last:border-0">
              <dt className="num w-12 shrink-0 text-sm text-muted">{y}</dt>
              <dd className={`font-ui text-[13px] ${y === 2019 ? "font-semibold text-emerald-800" : "text-muted"}`}>
                {vvpat[y]}
              </dd>
            </div>
          ))}
        </dl>
        <p className="num mt-4 text-2xl text-emerald-800">
          {(vvpat.unitsAvailable2019 / 100000).toFixed(2)} lakh
        </p>
        <p className="font-ui text-[11px] text-muted">VVPAT units available in 2019</p>
      </div>
    </div>
  );
}

export function PartyParticipationChart() {
  return (
    <figure className="min-w-0">
      <div style={{ height: 210 }} role="img"
        aria-label="Bar chart: parties participating in Lok Sabha elections rose from 363 in 2009 to 464 in 2014 to 673 in 2019.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={partyParticipation} margin={{ top: 18, right: 6, bottom: 0, left: -14 }}>
            <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={false} width={44} />
            <Bar dataKey="parties" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {partyParticipation.map((p) => (
                <Cell key={p.year} fill={p.year === 2019 ? "#047857" : "#B8B2A6"} />
              ))}
              <LabelList dataKey="parties" position="top" fontSize={11} fill="#6B675E" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="mt-3 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
        Party count alone does not prove opposition freedom — a party can register and still face
        pressure. It does make a claim that formal entry into party politics contracted hard to sustain.
      </figcaption>
    </figure>
  );
}

/* ── 6. media timeline ───────────────────────────────────────────────── */

const STATUS: Record<string, { label: string; cls: string }> = {
  implemented: { label: "Went off air", cls: "border-accent/40 bg-accent/[0.06] text-accent" },
  "not-implemented": { label: "Order not implemented", cls: "border-border bg-background text-muted" },
  reversed: { label: "Reversed by court or government", cls: "border-rahul/35 bg-rahul/[0.06] text-rahulInk" },
  alleged: { label: "Allegation", cls: "border-amber-600/35 bg-amber-500/[0.08] text-amber-800" },
};

export function MediaTimeline() {
  return (
    <ol className="relative space-y-3 border-l border-border pl-6">
      {mediaTimeline.map((e, i) => (
        <li key={i} className="relative">
          <span aria-hidden="true"
            className={`absolute -left-[1.855rem] top-2 h-2 w-2 rounded-full ${
              e.year <= 2014 ? "bg-muted" : "bg-accent"}`} />
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="num text-sm text-ink">{e.year}</span>
              <span className="eyebrow">{e.place}</span>
              <span className={`rounded-full border px-2 py-0.5 font-ui text-[10px] font-semibold ${STATUS[e.status].cls}`}>
                {STATUS[e.status].label}
              </span>
              <span className="ml-auto font-ui text-[10px] uppercase tracking-wider text-muted">
                {e.actor === "union" ? "Union government" : e.actor === "state" ? "State government" : "Judiciary"}
              </span>
            </div>
            <p className="font-ui text-[12.5px] leading-relaxed text-muted">{e.event}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── 7. FCRA comparison ──────────────────────────────────────────────── */

export function FCRAComparison() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {([2010, 2020] as const).map((y, i) => (
          <>
            {i === 1 && (
              <div key="arrow" className="flex items-center justify-center py-2 lg:py-0">
                <span aria-hidden="true" className="num text-xl text-muted lg:rotate-0">→</span>
              </div>
            )}
            <div key={y} className={`rounded-lg border p-5 ${
              y === 2010 ? "border-rahul/30 bg-rahul/[0.04]" : "border-modi/30 bg-modi/[0.04]"}`}>
              <p className="eyebrow">{fcra[y].subtitle}</p>
              <h4 className="mt-1 font-display text-2xl">{fcra[y].title}</h4>
              <ul className="mt-4 space-y-2">
                {fcra[y].items.map((it) => (
                  <li key={it} className="flex gap-2.5 font-ui text-[12.5px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-muted" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ))}
      </div>
      <p className="mt-5 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
        2020 made the regime stricter. But the baseline matters: the core restrictive architecture
        being evaluated already changed substantially in 2010, before the period under audit.
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {fcra.cancellations.map((c) => (
          <div key={c.period} className="rounded-lg border border-border bg-surface p-4">
            <dt className="eyebrow">{c.period}</dt>
            <dd className="num mt-1 text-2xl text-ink">{c.count}</dd>
            <dd className="mt-1 font-ui text-[10.5px] leading-relaxed text-muted">{c.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 max-w-reading font-ui text-[12.5px] leading-relaxed text-muted">
        This does not make later cancellations irrelevant. It shows that mass regulatory enforcement
        against FCRA organisations was not a post-2014 invention.
      </p>
    </>
  );
}

/* ── 8. indicator accordion ──────────────────────────────────────────── */

function EvidenceColumn({ title, items, tone }: { title: string; items?: string[]; tone: string }) {
  if (!items?.length) return null;
  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="eyebrow mb-2.5">{title}</p>
      <ul className="space-y-2">
        {items.map((f) => (
          <li key={f} className="flex gap-2.5 font-ui text-[12.5px] leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-muted" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IndicatorAccordion({ ind }: { ind: Indicator }) {
  const [open, setOpen] = useState(false);
  const hasBody = !!(ind.pre || ind.post || ind.facts || ind.conclusion);
  return (
    <li className="border-b border-border last:border-0">
      <button type="button" onClick={() => hasBody && setOpen(!open)}
        aria-expanded={hasBody ? open : undefined} disabled={!hasBody}
        className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 py-3.5 text-left
                    ${hasBody ? "hover:bg-ink/[0.02]" : "cursor-default opacity-70"}`}>
        <span className="min-w-0 flex-1">
          <span className="font-ui text-[13.5px] text-ink">{ind.name}</span>
          {ind.expertSynthesis && (
            <span className="ml-2 rounded border border-border px-1.5 py-0.5 font-ui text-[9.5px] uppercase tracking-wider text-muted">
              Expert synthesis variable
            </span>
          )}
          <span className="num ml-2 text-[10.5px] text-muted">{ind.vdem}</span>
        </span>
        <VerdictBadge v={ind.verdict} />
        {hasBody && (
          <span aria-hidden="true" className={`num text-xs text-muted transition-transform duration-300
                                               ${open ? "rotate-90" : ""}`}>›</span>
        )}
      </button>

      {open && hasBody && (
        <div className="fade-up pb-6">
          {ind.question && (
            <p className="mb-4 max-w-reading rounded-md border-l-2 border-border bg-background px-4 py-2.5
                          font-ui text-[12px] italic leading-relaxed text-muted">
              V-Dem asks: {ind.question}
            </p>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <EvidenceColumn title="Pre-2014 baseline" items={ind.pre}
              tone="border-border bg-background" />
            <EvidenceColumn title="Post-2014 condition" items={ind.post}
              tone="border-modi/25 bg-modi/[0.03]" />
          </div>
          {ind.facts && (
            <div className="mt-4">
              <EvidenceColumn title="Facts on record" items={ind.facts} tone="border-border bg-surface" />
            </div>
          )}
          {ind.conclusion && (
            <div className="mt-4 rounded-lg border border-rahul/25 bg-rahul/[0.04] p-4">
              <p className="eyebrow mb-2">Our audit conclusion</p>
              <p className="max-w-reading font-ui text-[13px] leading-relaxed text-ink/80">{ind.conclusion}</p>
            </div>
          )}
          {ind.caveat && (
            <p className="mt-3 max-w-reading rounded-md border-l-2 border-amber-600/50 bg-amber-500/[0.05]
                          px-4 py-2.5 font-ui text-[12px] leading-relaxed text-muted">
              <span className="font-semibold text-amber-800">What this does not settle. </span>
              {ind.caveat}
            </p>
          )}
          {ind.sources && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ind.sources.map((s) => <SourceChip key={s} id={s} />)}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export function SectionAudit({ s, n }: { s: Section; n: number }) {
  const audited = s.indicators.filter((i) => i.verdict !== "NOT_AUDITED").length;
  return (
    <section className="border-b border-border py-14" aria-labelledby={`sec-${s.key}`}>
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="eyebrow">0{n} — component audit</p>
        <h2 id={`sec-${s.key}`} className="scroll-mt-24 font-display text-3xl">{s.name}</h2>
        <span className="num text-[11px] text-muted">{s.vdem}</span>
        <VerdictBadge v={s.verdict} size="lg" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[["2010", s.v2010], ["2014", s.v2014], ["2023", s.v2023]].map(([y, v]) => (
          <div key={y as string} className="rounded-lg border border-border bg-surface p-4">
            <p className="eyebrow">{y as string}</p>
            <p className={`num mt-1 text-2xl ${y === "2023" ? "text-accent" : "text-ink"}`}>
              {(v as number).toFixed(3)}
            </p>
          </div>
        ))}
        <div className="rounded-lg border border-accent/30 bg-accent/[0.04] p-4">
          <p className="eyebrow text-accent">2014 → 2023</p>
          <p className="num mt-1 text-2xl text-accent">{(s.v2023 - s.v2014).toFixed(3)}</p>
        </div>
      </div>

      <p className="mb-8 max-w-reading font-body text-lg leading-relaxed text-muted">{s.headline}</p>

      <p className="eyebrow mb-1">
        Underlying indicators · {audited} of {s.indicators.length} audited
      </p>
      <ul className="border-t border-border">
        {s.indicators.map((i) => <IndicatorAccordion key={i.id} ind={i} />)}
      </ul>
    </section>
  );
}

/* ── 9. the matrix ───────────────────────────────────────────────────── */

export function AuditHeatmap() {
  const [open, setOpen] = useState<number | null>(null);
  const groups = ["Expression", "Clean Elections", "Association"];
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g}>
          <p className="eyebrow mb-3">{g}</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {matrix.map((r, i) => r.component !== g ? null : (
              <li key={r.indicator}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className={`flex h-full w-full flex-col rounded-lg border p-3.5 text-left
                              transition-transform duration-300 hover:-translate-y-0.5
                              ${VERDICT[r.verdict].tone}`}>
                  <span className="font-ui text-[12.5px] font-semibold leading-snug">{r.indicator}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-3 font-ui text-[10px] uppercase tracking-wider opacity-80">
                    <span aria-hidden="true" className="num">{VERDICT[r.verdict].mark}</span>
                    {VERDICT[r.verdict].label}
                  </span>
                  {open === i && (
                    <span className="fade-up mt-3 space-y-1.5 border-t border-current/20 pt-3
                                     font-ui text-[11px] leading-relaxed opacity-90">
                      <span className="block"><b>Pre-2014:</b> {r.pre}</span>
                      <span className="block"><b>Post-2014:</b> {r.post}</span>
                      <span className="block"><b>Direction:</b> {r.direction}</span>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function VerdictLegend() {
  return (
    <ul className="flex flex-wrap gap-2">
      {(Object.keys(VERDICT) as Verdict[]).map((v) => (
        <li key={v}><VerdictBadge v={v} /></li>
      ))}
    </ul>
  );
}

/* ── 10. methodology flow ────────────────────────────────────────────── */

const FLOW = [
  "Observable events and expert knowledge",
  "Country experts",
  "Ordinal assessments",
  "Bayesian measurement model",
  "Underlying V-Dem indicators",
  "Bayesian factor aggregation",
  "Expression · Association · Clean Elections",
  "Additive + multiplicative EDI formula",
  "Electoral Democracy score",
];

export function MethodologyFlow() {
  return (
    <ol className="space-y-1.5" aria-label="How a V-Dem score is produced, from observable events to the final index">
      {FLOW.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span className="num w-6 shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
          <span className={`flex-1 rounded-md border px-3.5 py-2 font-ui text-[12.5px] ${
            i >= FLOW.length - 3 ? "border-accent/25 bg-accent/[0.03] text-ink"
                                 : "border-border bg-surface text-muted"}`}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── 11. source drawer ───────────────────────────────────────────────── */

export function SourceDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        className="rounded-full border border-border bg-surface px-5 py-2.5 font-ui text-sm
                   font-semibold transition-all duration-300 hover:border-rahul/50 hover:text-rahulInk">
        {open ? "Hide sources" : `View all ${sources.length} sources`}
      </button>
      {open && (
        <ul className="fade-up mt-6 divide-y divide-border border-y border-border">
          {sources.map((s) => (
            <li key={s.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              <span className="min-w-0 flex-1 font-ui text-[13px] text-ink">{s.title}</span>
              <span className="font-ui text-[11.5px] text-muted">{s.publisher}</span>
              <span className="eyebrow">{s.type}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
        Publisher, title and document type are recorded for every source. Links are deliberately not
        fabricated — where a canonical URL has not been verified, none is shown.
      </p>
    </div>
  );
}

export function Callout({ tone = "note", title, children }: {
  tone?: "note" | "warn" | "key"; title?: string; children: ReactNode;
}) {
  const cls = tone === "warn" ? "border-amber-600/40 bg-amber-500/[0.05]"
            : tone === "key" ? "border-accent/30 bg-accent/[0.04]"
            : "border-border bg-surface";
  return (
    <div className={`max-w-reading rounded-lg border-l-2 border-y border-r px-5 py-4 ${cls}`}>
      {title && <p className="eyebrow mb-2">{title}</p>}
      <div className="font-ui text-[13px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}
