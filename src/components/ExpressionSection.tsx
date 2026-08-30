import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Cell, LabelList, ReferenceLine,
} from "recharts";
import {
  expression, expressionIndicators, censorshipTimeline, mediaBias,
  satelliteChannels, VERDICT, type Verdict, type ExprIndicator,
} from "../lib/democracy";
import { VerdictBadge, SourceChip, Callout } from "./DemocracyParts";

/* ── 1. the score itself ─────────────────────────────────────────────── */

function ScoreChart() {
  return (
    <figure className="min-w-0">
      <p className="eyebrow mb-4">V-Dem&rsquo;s Freedom of Expression score for India</p>
      <div style={{ height: 300 }} role="img"
        aria-label="Line chart: India's V-Dem Freedom of Expression score was 0.889 in 2010, 0.812 in 2014 and 0.422 in 2023.">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={expression.values} margin={{ top: 24, right: 40, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="year" type="category"
                   tick={{ fontSize: 11, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
            <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]}
                   tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={false} width={52} />
            <ReferenceLine x={2014} stroke="#1A1A18" strokeDasharray="3 3" strokeOpacity={0.5}
              label={{ value: "comparison point", position: "insideTopRight", fontSize: 10, fill: "#6B675E" }} />
            <Line type="linear" dataKey="score" stroke="#D2691E" strokeWidth={2.6}
                  dot={{ r: 5, fill: "#D2691E", strokeWidth: 0 }} isAnimationActive={false}>
              <LabelList dataKey="score" position="top" offset={12} fontSize={13} fill="#803A07"
                formatter={(n) => Number(n).toFixed(3)} />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="eyebrow">2010 → 2014</dt>
          <dd className="num mt-1 text-2xl text-ink">{expression.changes.pre.toFixed(3)}</dd>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/[0.05] p-4">
          <dt className="eyebrow text-accent">2014 → 2023</dt>
          <dd className="num mt-1 text-2xl text-accent">{expression.changes.post.toFixed(3)}</dd>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="eyebrow">Share of the 2014 value</dt>
          <dd className="num mt-1 text-2xl text-accent">{expression.changes.postPercentOf2014}%</dd>
        </div>
      </dl>
      <p className="mt-4 font-ui text-[13px] text-muted">
        The post-2014 decline is about <span className="num text-ink">5×</span> the preceding decline.
        That ratio proves nothing on its own — it is the thing requiring an explanation.
      </p>
      <figcaption className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
        The question is not whether restrictive incidents occurred after 2014. They clearly did. The
        question is whether the underlying environment changed enough relative to the earlier
        baseline to justify a decline five times larger than during 2010–2014.
      </figcaption>
    </figure>
  );
}

/* ── 2. how the score is built ───────────────────────────────────────── */

function HowItIsBuilt() {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <ul className="space-y-1.5" aria-label="The nine expert-coded indicators feeding the Freedom of Expression score">
          {expression.inputs.map((n) => (
            <li key={n} className="rounded-md border border-border bg-surface px-3.5 py-2
                                   font-ui text-[12.5px] text-muted">{n}</li>
          ))}
        </ul>
        <div className="mt-3 space-y-2 text-center">
          <p aria-hidden="true" className="num text-lg text-muted">↓</p>
          <p className="rounded-md border border-border bg-background px-3.5 py-2 font-ui text-[12.5px] text-ink">
            Bayesian factor model
          </p>
          <p aria-hidden="true" className="num text-lg text-muted">↓</p>
          <div className="rounded-lg border border-accent/30 bg-accent/[0.05] px-3.5 py-4">
            <p className="font-ui text-[12.5px] text-ink">Freedom of Expression &amp; Alternative Information</p>
            <p className="num mt-1 text-3xl text-accent">0.422</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4 lg:col-span-5">
        <p className="max-w-reading font-body text-lg leading-relaxed text-muted">
          V-Dem does not simply count arrests, banned channels or protests. Country experts rate
          these underlying conditions, and V-Dem combines the expert assessments statistically using
          a Bayesian measurement model.
        </p>
        <Callout tone="warn" title="What follows from that">
          This allows V-Dem to measure difficult concepts that have no natural unit. It also means a
          large score change cannot be independently reconstructed from a simple public ledger of
          incidents — which is exactly why the comparison below is against the earlier baseline
          rather than against a target.
        </Callout>
      </div>
    </div>
  );
}

/* ── 3. audit summary + distribution ─────────────────────────────────── */

const SUMMARY: { v: Verdict; n: number }[] = [
  { v: "NOT_ESTABLISHED", n: expression.summary.NOT_ESTABLISHED },
  { v: "SUPPORTED", n: expression.summary.SUPPORTED },
  { v: "MIXED", n: expression.summary.MIXED },
];

function AuditSummary() {
  const max = 9;
  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-3">
        {SUMMARY.map(({ v, n }) => (
          <div key={v} className={`rounded-lg border p-5 ${VERDICT[v].tone}`}>
            <dt className="num text-3xl">{n} / 9</dt>
            <dd className="mt-1.5 font-ui text-[12px] font-semibold leading-snug">{VERDICT[v].label}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <p className="eyebrow mb-3">What kind of evidence did we find?</p>
        <ul className="space-y-2" role="img"
          aria-label="Five of nine indicators: downgrade not established. Three: some deterioration supported. One: mixed evidence.">
          {SUMMARY.map(({ v, n }) => (
            <li key={v} className="flex items-center gap-3">
              <span className="w-[13.5rem] shrink-0 font-ui text-[12px] text-muted">{VERDICT[v].label}</span>
              <span className="h-5 flex-1 overflow-hidden rounded-sm bg-border/50">
                <span className={`block h-full rounded-sm ${VERDICT[v].dot}`}
                      style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className="num w-6 shrink-0 text-right text-sm text-ink">{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
          V-Dem uses a statistical factor model; these nine indicators are not necessarily equally
          weighted. This chart summarises our audit findings, not V-Dem&rsquo;s mathematical
          weighting. These are fact-check classifications, not replacements for V-Dem&rsquo;s
          numerical sub-indicator scores.
        </p>
      </div>
    </>
  );
}

/* ── 4. the nine-indicator matrix ────────────────────────────────────── */

function EvidenceList({ title, items, tone }: { title: string; items: { when: string; fact: string }[]; tone: string }) {
  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="eyebrow mb-2.5">{title}</p>
      <ul className="space-y-2.5">
        {items.map((f) => (
          <li key={f.fact} className="font-ui text-[12.5px] leading-relaxed text-muted">
            <span className="num mr-2 text-[11px] text-ink/70">{f.when}</span>{f.fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IndicatorRow({ ind }: { ind: ExprIndicator }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-border last:border-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        className="flex w-full flex-wrap items-start gap-x-4 gap-y-2 py-4 text-left hover:bg-ink/[0.02]">
        <span className="num w-6 shrink-0 pt-0.5 text-[11px] text-muted">
          {String(ind.order).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-ui text-[13.5px] text-ink">{ind.name}</span>
          <span className="mt-0.5 block max-w-reading font-ui text-[11.5px] leading-relaxed text-muted">
            {ind.measures}
          </span>
        </span>
        {/* verdict stays visible without opening the card */}
        <VerdictBadge v={ind.verdict} />
        <span aria-hidden="true"
          className={`num pt-1 text-xs text-muted transition-transform duration-300 ${open ? "rotate-90" : ""}`}>›</span>
      </button>

      {open && (
        <div className="fade-up pb-6 pl-0 sm:pl-10">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="eyebrow mb-2">Pre-2014 baseline</p>
              <p className="font-ui text-[12.5px] leading-relaxed text-muted">{ind.pre}</p>
            </div>
            <div className="rounded-lg border border-modi/25 bg-modi/[0.03] p-4">
              <p className="eyebrow mb-2">Post-2014 condition</p>
              <p className="font-ui text-[12.5px] leading-relaxed text-muted">{ind.post}</p>
            </div>
          </div>

          {(ind.preFacts || ind.postFacts) && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {ind.preFacts && <EvidenceList title="On the record, before 2014" items={ind.preFacts} tone="border-border bg-surface" />}
              {ind.postFacts && <EvidenceList title="On the record, after 2014" items={ind.postFacts} tone="border-border bg-surface" />}
            </div>
          )}
          {ind.facts && (
            <div className="mt-4">
              <EvidenceList title="Comparable counts" items={ind.facts} tone="border-border bg-surface" />
            </div>
          )}

          <div className="mt-4 rounded-lg border border-rahul/25 bg-rahul/[0.04] p-4">
            <p className="eyebrow mb-2">Our audit conclusion</p>
            <p className="max-w-reading font-ui text-[13px] leading-relaxed text-ink/80">{ind.conclusion}</p>
          </div>
          {ind.caveat && (
            <p className="mt-3 max-w-reading rounded-md border-l-2 border-amber-600/50 bg-amber-500/[0.05]
                          px-4 py-2.5 font-ui text-[12px] leading-relaxed text-muted">
              <span className="font-semibold text-amber-800">What this does not settle. </span>{ind.caveat}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="num rounded border border-border bg-background px-2 py-0.5 text-[10px] text-muted">
              {ind.vdem}
            </span>
            {ind.sources.map((s) => <SourceChip key={s} id={s} />)}
          </div>
        </div>
      )}
    </li>
  );
}

/* ── 5. censorship timeline, two lanes ───────────────────────────────── */

function CensorshipTimeline() {
  const lane = (era: "pre" | "post") => censorshipTimeline.filter((e) => e.era === era);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {(["pre", "post"] as const).map((era) => (
        <div key={era} className={`rounded-lg border p-5 ${
          era === "pre" ? "border-border bg-background" : "border-modi/25 bg-modi/[0.03]"}`}>
          <p className="eyebrow mb-4">{era === "pre" ? "Pre-2014" : "Post-2014"}</p>
          <ol className="space-y-3">
            {lane(era).map((e) => (
              <li key={`${e.year}-${e.event}`} className="rounded-md border border-border bg-surface p-3.5">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="num text-sm text-ink">{e.year}</span>
                  <span className="font-ui text-[10px] uppercase tracking-wider text-muted">{e.status}</span>
                </div>
                <p className="font-ui text-[12.5px] leading-relaxed text-muted">{e.event}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ── 6. media bias ───────────────────────────────────────────────────── */

function MediaBias() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <figure className="min-w-0 rounded-lg border border-border bg-surface p-5">
        <p className="eyebrow">2014 — opposition dominated political visibility</p>
        <p className="mt-1 font-ui text-[11px] text-muted">CMS Media Lab, early-campaign share of leader coverage</p>
        <ul className="mt-5 space-y-3">
          {mediaBias.y2014.map((r) => (
            <li key={r.leader}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="font-ui text-[12.5px] text-ink">
                  {r.leader}
                  <span className="ml-2 font-normal text-[10.5px] text-muted">{r.status}</span>
                </span>
                <span className="num text-sm text-ink">{r.share}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-sm bg-border/50">
                <div className={`h-full rounded-sm ${r.status === "Opposition" ? "bg-modi" : "bg-rahul"}`}
                     style={{ width: `${(r.share / 30) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <figcaption className="mt-4 font-ui text-[11px] leading-relaxed text-muted">
          In 2014 the two figures with the highest television visibility were both in opposition;
          the incumbent party&rsquo;s leader had a fraction of it.
        </figcaption>
      </figure>

      <figure className="min-w-0 rounded-lg border border-accent/25 bg-accent/[0.04] p-5">
        <p className="eyebrow">2019 — DD News campaign coverage</p>
        <p className="mt-1 font-ui text-[11px] text-muted">Election Commission of India analysis, approximate hours</p>
        <div className="mt-4" style={{ height: 170 }} role="img"
          aria-label="Bar chart: DD News gave the BJP about 160 hours of campaign coverage in 2019 against about 80 hours for Congress.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mediaBias.y2019} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 14 }}>
              <XAxis type="number" hide domain={[0, 180]} />
              <YAxis type="category" dataKey="party" width={72}
                     tick={{ fontSize: 12, fill: "#6B675E", fontFamily: "Plus Jakarta Sans" }}
                     tickLine={false} axisLine={false} />
              <Bar dataKey="hours" radius={[0, 3, 3, 0]} isAnimationActive={false} barSize={30}>
                {mediaBias.y2019.map((r) => (
                  <Cell key={r.party} fill={r.party === "BJP" ? "#D2691E" : "#1D5FA8"} />
                ))}
                <LabelList dataKey="hours" position="right" fontSize={12} fill="#6B675E"
                  formatter={(n) => `≈${Number(n)} hrs`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <figcaption className="mt-2 font-ui text-[12px] leading-relaxed text-muted">
          The Election Commission itself found DD&rsquo;s treatment inconsistent with neutrality and
          a level playing field. This is one of the places our own audit finds evidence supporting a
          post-2014 criticism.
        </figcaption>
      </figure>
    </div>
  );
}

/* ── 7. media ecosystem ──────────────────────────────────────────────── */

function ChannelChart() {
  return (
    <figure className="min-w-0">
      <h3 className="font-display text-2xl">Did India&rsquo;s media ecosystem become smaller?</h3>
      <p className="mt-2 max-w-reading font-ui text-sm leading-relaxed text-muted">
        The number of channels does not by itself prove viewpoint diversity, but it provides useful
        context when evaluating claims that alternative information largely disappeared.
      </p>
      <div className="mt-6" style={{ height: 210 }} role="img"
        aria-label="Bar chart of permitted private satellite television channels: 603 in 2010-11, 859 in 2013-14, 918 in 2019-20 and 905 in 2022-23.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={satelliteChannels} margin={{ top: 18, right: 6, bottom: 0, left: -14 }}>
            <CartesianGrid stroke="#E4E0D8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 10.5, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={{ stroke: "#E4E0D8" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6B675E", fontFamily: "JetBrains Mono" }}
                   tickLine={false} axisLine={false} width={44} />
            <Bar dataKey="channels" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {satelliteChannels.map((c) => (
                <Cell key={c.period} fill={c.period === "2013–14" ? "#1A1A18" : "#B8B2A6"} />
              ))}
              <LabelList dataKey="channels" position="top" fontSize={11} fill="#6B675E" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 max-w-reading rounded-md border-l-2 border-amber-600/50 bg-amber-500/[0.05]
                    px-4 py-2.5 font-ui text-[12px] leading-relaxed text-muted">
        Ownership concentration can reduce editorial independence even when the number of channels
        rises. Do not use channel count as proof that every viewpoint receives equal reach. The dark
        bar marks the 2013–14 baseline.
      </p>
    </figure>
  );
}

/* ── the section ─────────────────────────────────────────────────────── */

export function ExpressionSection({ n }: { n: number }) {
  return (
    <section className="border-b border-border py-14" aria-labelledby="sec-expression">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="eyebrow">0{n} — component 1 of 3</p>
        <h2 id="sec-expression" className="max-w-[24ch] scroll-mt-24 font-display text-3xl leading-[1.15]">
          Freedom of Expression &amp; Alternative Information
        </h2>
        <span className="num text-[11px] text-muted">{expression.vdem}</span>
      </div>
      <p className="num mb-6 text-lg text-muted">
        V-Dem score: 0.889 <span className="opacity-40">→</span> 0.812{" "}
        <span className="opacity-40">→</span> <span className="text-accent">0.422</span>
      </p>

      <div className="max-w-reading space-y-4 font-body text-lg leading-relaxed text-muted">
        <p>
          Freedom of Expression is the single largest contributor to India&rsquo;s Electoral
          Democracy decline. V-Dem reduced India&rsquo;s score from 0.812 in 2014 to 0.422 in 2023,
          a fall of <span className="num text-ink">0.390</span> — nearly{" "}
          <span className="num text-ink">48%</span> of the 2014 value.
        </p>
        <p>
          But this number is not directly measured. It is constructed from nine underlying
          expert-coded indicators covering media censorship, journalist harassment, media bias,
          self-censorship, political discussion and academic freedom. We checked those claims
          against the pre-2014 baseline.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-accent/30 bg-accent/[0.04] p-6">
        <p className="eyebrow mb-2 text-accent">Audit result</p>
        <p className="max-w-[30ch] font-display text-2xl leading-snug">
          Large downgrade not established by the evidence reviewed
        </p>
        <p className="mt-3 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
          Real post-2014 concerns exist, and one — the Election Commission&rsquo;s finding that the
          state broadcaster was not neutral in 2019 — survives comparison. But the evidence reviewed
          does not show deterioration across the nine underlying dimensions relative to the earlier
          baseline, and does not explain a fall as large as 0.812 → 0.422.
        </p>
      </div>

      <div className="mt-12"><ScoreChart /></div>

      <div className="mt-14">
        <h3 className="mb-6 font-display text-2xl">How the score is constructed</h3>
        <HowItIsBuilt />
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl">The nine underlying indicators</h3>
        <p className="mt-2 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Each is compared against its own pre-2014 baseline, not against an ideal. Select any row
          for the evidence behind the verdict.
        </p>
        <div className="mt-8"><AuditSummary /></div>
        <ul className="mt-8 border-t border-border">
          {expressionIndicators.map((i) => <IndicatorRow key={i.id} ind={i} />)}
        </ul>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl">Did government interference with news begin after 2014?</h3>
        <p className="mt-2 max-w-reading font-ui text-sm leading-relaxed text-muted">
          Censorship is the sub-indicator we investigated most deeply. Setting the two periods
          side by side is more useful than listing post-2014 incidents alone.
        </p>
        <div className="mt-6"><CensorshipTimeline /></div>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-2xl">Media bias: what coverage share can and cannot show</h3>
        <div className="mt-6"><MediaBias /></div>
      </div>

      <div className="mt-14"><ChannelChart /></div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-rahul/25 bg-rahul/[0.04] p-6">
          <p className="eyebrow mb-3">What our audit does show</p>
          <ul className="space-y-2.5">
            {[
              "Freedom of Expression is the largest numerical driver of India's Electoral Democracy decline.",
              "Several genuine post-2014 concerns exist, and none of them is disputed here.",
              "The strongest surviving finding is narrow: the Election Commission found the state broadcaster's 2019 campaign coverage inconsistent with neutrality.",
              "Serious censorship, arrests for political speech, journalist prosecution, syllabus withdrawals by universities, a state book ban and an artist's exile all sit in the pre-2014 baseline.",
              "For seven of the nine underlying dimensions, the comparative evidence does not establish a clear post-2014 deterioration; two remain mixed.",
              "The evidence reviewed does not explain a component fall as large as 0.812 → 0.422.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 font-ui text-[12.5px] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-rahul" />{t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="eyebrow mb-3">What our audit does not show</p>
          <ul className="space-y-2.5">
            {[
              "That India has perfect freedom of expression.",
              "That journalists are never harassed.",
              "That government pressure does not exist.",
              "That all nine V-Dem indicators are wrong.",
              "That no deterioration occurred in any of these areas — several verdicts turn on comparisons we have not completed, not on evidence of no change.",
              "That the exact correct score should still be 0.812.",
              "That V-Dem intentionally manipulated India's score.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 font-ui text-[12.5px] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-border" />{t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-accent/30 bg-accent/[0.04] p-6">
        <p className="eyebrow mb-2 text-accent">Fact-check verdict</p>
        <p className="max-w-[34ch] font-display text-2xl leading-snug">
          Some deterioration is real. The magnitude of the V-Dem decline is not established.
        </p>
        <div className="mt-4 max-w-reading space-y-3 font-ui text-[13px] leading-relaxed text-muted">
          <p>
            India&rsquo;s expression environment after 2014 contains genuine problems, and this audit
            does not dispute them. The clearest is the Election Commission&rsquo;s own finding that
            Doordarshan&rsquo;s 2019 campaign coverage was inconsistent with neutrality — a
            regulator&rsquo;s determination about a broadcaster legally bound to be impartial.
          </p>
          <p>
            But the broader V-Dem score falls by almost half — from 0.812 to 0.422. When the same
            nine dimensions are compared against the pre-2014 baseline, serious censorship, arrests
            for political speech, journalist prosecution, self-censorship, university syllabus
            withdrawals, a state book ban and an artist driven into exile are already visible in the
            earlier period.
          </p>
          <p>
            For seven of the nine underlying indicators, our review has not established a clear
            post-2014 deterioration. Two remain mixed. On journalist harassment the counts do differ
            — three imprisoned in 2012 against seven in 2022 and 2023 — but we have not case-checked
            them, and this page does not accept a count as a finding.
          </p>
          <p className="text-ink">
            The evidence reviewed therefore supports criticism of specific post-2014 developments,
            but does not adequately explain the magnitude of V-Dem&rsquo;s Freedom of Expression
            downgrade.
          </p>
        </div>
        <p className="mt-4 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
          &ldquo;Downgrade not established&rdquo; means the evidence reviewed does not demonstrate
          deterioration relative to the earlier baseline. It does not mean no negative incidents
          occurred.
        </p>
      </div>
    </section>
  );
}
