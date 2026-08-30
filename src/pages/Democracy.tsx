import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  sections, periodChanges, auditCounts, VERDICT, matrix,
} from "../lib/democracy";
import {
  ScoreHero, ComponentSlopeChart, ComponentBreakdown, IndexFormula,
  WeakestLinkCalculator, ElectionCapacityChart, PartyParticipationChart,
  MediaTimeline, FCRAComparison, SectionAudit, AuditHeatmap, VerdictLegend,
  MethodologyFlow, SourceDrawer, Callout,
} from "../components/DemocracyParts";
import { ExpressionSection } from "../components/ExpressionSection";

export default function Democracy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const c = auditCounts();
  const notAudited = c.NOT_AUDITED;
  const audited = matrix.length - notAudited;

  return (
    <article className="mx-auto max-w-5xl px-6 py-14">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 transition-colors
                              duration-300 hover:text-rahulInk">← Back to the comparison</Link>

      {/* ── hero ─────────────────────────────────────────────────────── */}
      <header className="mt-6 border-b border-border pb-12">
        <p className="eyebrow mb-4">Auditing India&rsquo;s democracy score</p>
        <h1 className="max-w-[22ch] font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
          India fell from <span className="num">0.617</span> to{" "}
          <span className="num text-accent">0.374</span>.{" "}
          <span className="italic">Do the underlying facts justify it?</span>
        </h1>
        <p className="mt-3 font-display text-xl italic text-muted">
          A fact check of V-Dem&rsquo;s underlying indicators
        </p>
        <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
          V-Dem&rsquo;s decline comes almost entirely from three components: expression, clean
          elections and association. We traced those scores beneath the headline and compared the
          post-2014 evidence with the period V-Dem scores more highly.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#fell" className="rounded-full bg-ink px-5 py-2.5 font-ui text-sm font-semibold
                                     text-background transition-all duration-300 hover:bg-rahulInk">
            See what actually fell
          </a>
          <a href="#formula" className="rounded-full border border-border bg-surface px-5 py-2.5
                                        font-ui text-sm transition-all duration-300
                                        hover:border-rahul/50 hover:text-rahulInk">
            How V-Dem calculates it
          </a>

          {/* Straight to the value a reader came to check, rather than scrolling
              past two components to reach the third. */}
          <span aria-hidden="true" className="hidden self-center px-1 text-border sm:block">|</span>
          {[
            ["#sec-expression", "Expression", "−0.390"],
            ["#sec-clean", "Clean Elections", "−0.189"],
            ["#sec-association", "Association", "−0.172"],
            ["#matrix", "All 23 indicators", ""],
          ].map(([href, label, delta]) => (
            <a key={href} href={href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface
                         px-4 py-2.5 font-ui text-[13px] text-muted transition-all duration-300
                         hover:border-accent/50 hover:text-accent">
              {label}
              {delta && <span className="num text-[11.5px] text-accent">{delta}</span>}
            </a>
          ))}
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["−0.390", "Freedom of Expression", "text-accent"],
            ["−0.189", "Clean Elections", "text-accent"],
            ["−0.172", "Freedom of Association", "text-accent"],
            ["0", "Suffrage · Elected Officials", "text-emerald-800"],
          ].map(([v, k, cls]) => (
            <div key={k} className="rounded-lg border border-border bg-surface p-4">
              <dt className={`num text-3xl ${cls}`}>{v}</dt>
              <dd className="mt-1 font-ui text-[11.5px] leading-snug text-muted">{k}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-ui text-[11px] leading-relaxed text-muted">
          Clean Elections values shown here are reconstructed from V-Dem&rsquo;s published EDI formula
          and the supplied India panel, because the panel carries the index, Expression and
          Association but not <span className="num">v2xel_frefair</span>. They are marked derived
          wherever they appear.
        </p>
      </header>

      {/* ── what this page is, and is not ────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">The question</p>
        <h2 className="max-w-[30ch] font-display text-3xl leading-[1.15]">
          Not &ldquo;does India have problems?&rdquo; but &ldquo;did they get worse than before?&rdquo;
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-accent/25 bg-accent/[0.03] p-5">
            <p className="eyebrow mb-2 text-accent">Reasoning we refuse to use</p>
            <p className="font-ui text-[13px] leading-relaxed text-muted">
              &ldquo;A bad event happened after 2014, therefore India deteriorated.&rdquo; An
              incident is not a comparison. Every claim on this page is measured against what the
              same indicator looked like before 2014.
            </p>
          </div>
          <div className="rounded-lg border border-rahul/25 bg-rahul/[0.04] p-5">
            <p className="eyebrow mb-2">The test we apply</p>
            <p className="font-ui text-[13px] leading-relaxed text-muted">
              Pre-2014 baseline against post-2014 condition. A downgrade counts as factually
              supported only where comparable evidence shows deterioration relative to the earlier
              period.
            </p>
          </div>
        </div>
        {/* Full article width, and the three conclusions run across rather than
            down — same words, roughly a third of the height. */}
        <div className="mt-6 rounded-lg border border-accent/30 bg-accent/[0.04] px-6 py-4">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="eyebrow text-accent">What our audit concludes</p>
            <p className="font-ui text-[13px] text-muted">
              Three progressively stronger conclusions.
            </p>
          </div>
          <ol className="grid gap-x-6 gap-y-4 lg:grid-cols-3">
            {[
              ["First", <>India&rsquo;s post-2014 democracy downgrade is <strong className="font-semibold text-ink">misleading where the historical evidence does not support the scale or direction of the fall</strong>.</>],
              ["Second", <>When comparable pre-2014 restrictions are repeatedly treated more leniently while similar post-2014 events produce sharp penalties, the problem is no longer just an isolated error — it points to a <strong className="font-semibold text-ink">systematically biased scoring framework</strong>.</>],
              ["Third", <>If such asymmetry persists even where the underlying historical record is well documented, it is reasonable to ask whether the distortion is merely methodological or whether it reflects <strong className="font-semibold text-ink">deliberate ideological selectivity</strong>.</>],
            ].map(([label, body], i) => (
              <li key={label as string} className="border-t border-accent/25 pt-3 lg:border-l lg:border-t-0
                                                   lg:pl-5 lg:pt-0 lg:first:border-l-0 lg:first:pl-0">
                <p className="eyebrow mb-1">
                  <span className="num mr-2 text-accent">{`0${i + 1}`}</span>{label as string}
                </p>
                <p className="font-ui text-[12.5px] leading-[1.5] text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-accent/25 pt-3 font-ui text-[12px] leading-[1.55] text-muted">
            We cannot directly observe the intent of individual coders, but intent does not erase the
            outcome: a score that repeatedly ignores comparable earlier failures while heavily
            penalising later ones gives readers a distorted picture of how India actually changed.
          </p>
        </div>
      </section>

      {/* ── the score ────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">01 — the score</p>
        <h2 className="font-display text-3xl">What V-Dem records</h2>
        <div className="mt-8"><ScoreHero /></div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5">
            <dt className="eyebrow">2010 → 2014 decline</dt>
            <dd className="num mt-1 text-3xl text-ink">{periodChanges["2010_to_2014"].electoralDemocracy}</dd>
          </div>
          <div className="rounded-lg border border-accent/30 bg-accent/[0.04] p-5">
            <dt className="eyebrow text-accent">2014 → 2023 decline</dt>
            <dd className="num mt-1 text-3xl text-accent">{periodChanges["2014_to_2023"].electoralDemocracy}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-reading font-body text-lg leading-relaxed text-muted">
          The post-2014 decline is about <span className="text-ink">4.5 times</span> the size of the
          decline in the four years before it.
        </p>
        <p className="mt-3 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
          That ratio proves nothing on its own. A country&rsquo;s democratic conditions can genuinely
          worsen four times faster in one period than another. It is simply the thing that requires
          an explanation, and the rest of this page looks for one in the underlying indicators.
        </p>
        <div className="mt-10"><ComponentSlopeChart /></div>
      </section>

      {/* ── only three fell ──────────────────────────────────────────── */}
      <section className="border-b border-border py-14" aria-labelledby="fell">
        <p className="eyebrow mb-3">02 — where the fall comes from</p>
        <h2 id="fell" className="max-w-[26ch] scroll-mt-24 font-display text-3xl leading-[1.15]">
          Two of the five components did not move at all
        </h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          Elected Officials and Universal Suffrage sit at 1.000 in 2010, 2014 and 2023. India&rsquo;s
          representatives are still elected, and every adult still votes. The entire factual dispute
          is therefore concentrated in three areas.
        </p>
        <div className="mt-8"><ComponentBreakdown /></div>
      </section>

      {/* ── formula ──────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14" aria-labelledby="formula">
        <p className="eyebrow mb-3">03 — the method</p>
        <h2 id="formula" className="max-w-[28ch] scroll-mt-24 font-display text-3xl leading-[1.15]">
          Half of the index is a multiplication, not an average
        </h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          This is not hidden and not a flaw — it is V-Dem&rsquo;s deliberate &ldquo;weakest
          link&rdquo; concept. But it has a consequence worth seeing plainly: when three components
          fall at once, they compound.
        </p>
        <div className="mt-8"><IndexFormula /></div>
        <div className="mt-10">
          <p className="eyebrow mb-4">Try it yourself</p>
          <WeakestLinkCalculator />
        </div>
      </section>

      {/* ── the three audits ─────────────────────────────────────────── */}
      {/* Expression gets its own deep audit; the other two use the shared layout. */}
      <ExpressionSection n={4} />
      {sections.filter((s) => s.key !== "expression")
               .map((s, i) => <SectionAudit key={s.key} s={s} n={i + 5} />)}

      {/* ── objective counter-evidence ───────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">07 — objective indicators</p>
        <h2 className="max-w-[30ch] font-display text-3xl leading-[1.15]">
          Measures that moved in the opposite direction
        </h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          These are administrative counts, not expert judgments. They do not prove that every aspect
          of election quality improved. They do make a broad claim of declining election-management
          capacity difficult to sustain without identifying countervailing evidence.
        </p>
        <div className="mt-8"><ElectionCapacityChart /></div>

        <div className="mt-12">
          <h3 className="font-display text-2xl">Did India become less multiparty?</h3>
          <p className="mt-2 max-w-reading font-ui text-sm leading-relaxed text-muted">
            Election Commission data show the opposite trend in the number of parties participating
            in Lok Sabha elections.
          </p>
          <div className="mt-6"><PartyParticipationChart /></div>
        </div>
      </section>

      {/* ── timelines ────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">08 — comparable events, both periods</p>
        <h2 className="font-display text-3xl">Broadcast restrictions, 2008 to 2023</h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          Interference with broadcasting is real in both periods. What matters for a comparative
          score is whether it became clearly more frequent or more severe — so each event is marked
          by whether it was carried out, attempted and dropped, reversed, or only alleged, and by
          whether a state or the Union government acted.
        </p>
        <div className="mt-8"><MediaTimeline /></div>

        <div className="mt-14">
          <h3 className="font-display text-2xl">FCRA did not begin in 2020</h3>
          <p className="mt-2 max-w-reading font-ui text-sm leading-relaxed text-muted">
            The regulation of foreign funding to civil society is central to the Association score.
            Its structure changed most in 2010.
          </p>
          <div className="mt-6"><FCRAComparison /></div>
        </div>
      </section>

      {/* ── matrix ───────────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">09 — the audit matrix</p>
        <h2 id="matrix" className="scroll-mt-24 font-display text-3xl">All {matrix.length} underlying indicators</h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          {notAudited === 0
            ? `All ${audited} now carry a completed or partial comparison against the pre-2014 baseline.`
            : `${audited} carry a completed or partial comparison. ${notAudited} do not yet, and are marked as pending rather than dismissed — an unaudited indicator has not been disproved, it has not been checked.`}{" "}
          A verdict of “downgrade not established” is a statement about the evidence reviewed, not a
          finding that nothing happened.
        </p>
        <div className="mt-6"><VerdictLegend /></div>
        <div className="mt-8"><AuditHeatmap /></div>
        <p className="mt-6 font-ui text-[11px] text-muted">Select any tile to see the comparison behind it.</p>
      </section>

      {/* ── methodology ──────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">10 — who produces these values</p>
        <h2 className="max-w-[28ch] font-display text-3xl leading-[1.15]">
          Expert judgment, aggregated by a statistical model
        </h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          V-Dem is an academic democracy-measurement project, not a media organisation, and this
          section describes its method fairly. For many subjective indicators, country experts answer
          detailed questions — V-Dem generally aims for at least five per country-indicator, with
          roughly two-thirds intended to be nationals or residents. Contemporary expert identities are
          confidential. Ordinal answers are aggregated through Bayesian measurement models that adjust
          for differences in scale use and estimated reliability. Final values are model-generated
          latent estimates rather than direct administrative statistics.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <MethodologyFlow />
          <div className="space-y-4">
            <Callout title="Why this design exists">
              This methodology measures concepts that cannot be captured through simple
              administrative statistics. Press freedom has no unit. Because expert judgment remains
              central, transparent comparison against observable historical facts is still valuable —
              which is all this page attempts.
            </Callout>
            <Callout tone="warn" title="Scores can change retrospectively">
              V-Dem allows historical values to change in later releases when coders revise ratings,
              or when new coders and data are added. A figure for 2014 is not necessarily the figure
              that was published in 2014.
            </Callout>
          </div>
        </div>
      </section>

      {/* ── conclusion ───────────────────────────────────────────────── */}
      <section className="border-b border-border py-14">
        <p className="eyebrow mb-3">11 — our finding</p>
        <h2 className="max-w-[24ch] font-display text-3xl leading-[1.15] sm:text-4xl">
          What the evidence does, and does not, prove
        </h2>
        <div className="mt-6 max-w-reading space-y-4 font-body text-lg leading-relaxed text-muted">
          <p>
            India&rsquo;s V-Dem Electoral Democracy score fell from{" "}
            <span className="num text-ink">0.617</span> in 2014 to{" "}
            <span className="num text-accent">0.374</span> in 2023. Elected officials and universal
            suffrage did not cause the decline. The fall is generated by Freedom of Expression, Clean
            Elections and Freedom of Association.
          </p>
          <p>
            Our audit finds genuine post-2014 concerns in all three areas. However, comparable
            problems also existed before 2014, while several objective indicators — including
            election-management capacity, nationwide VVPAT deployment and the number of parties
            contesting Lok Sabha elections — moved in the opposite direction.
          </p>
          <p className="text-ink">
            The evidence reviewed therefore does not adequately establish the magnitude of the
            post-2014 downgrade.
          </p>
          <p>
            This is not proof that every V-Dem assessment is wrong, nor proof of intentional
            manipulation. It is evidence that headline democracy scores should not be accepted
            without examining the historical baseline and the underlying inputs.
          </p>
        </div>

        <div className="mt-10">
          <p className="eyebrow mb-4">Three questions every democracy ranking should answer</p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              "What exactly changed?",
              "Was the same problem already present in the comparison year?",
              "Does the magnitude of the score change match the magnitude of the factual change?",
            ].map((q, i) => (
              <li key={q} className="rounded-lg border border-border bg-surface p-5">
                <span className="num text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-lg leading-snug">{q}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── sources ──────────────────────────────────────────────────── */}
      <section className="py-14">
        <p className="eyebrow mb-3">12 — check it yourself</p>
        <h2 className="font-display text-3xl">Don&rsquo;t trust our conclusion. Check the evidence.</h2>
        <p className="mt-4 max-w-reading font-body text-lg leading-relaxed text-muted">
          Every source used in this audit is exposed to the reader. The purpose of this page is not
          to replace one authority with another. It is to make the assumptions underneath a headline
          democracy score visible enough that anyone can challenge them — including us.
        </p>
        <div className="mt-8"><SourceDrawer /></div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full border border-border bg-surface px-5 py-2.5 font-ui
                                  text-sm transition-all duration-300 hover:border-rahul/50
                                  hover:text-rahulInk">
            ← Back to the comparison
          </Link>
          <Link to="/read" className="rounded-full border border-border bg-surface px-5 py-2.5 font-ui
                                      text-sm transition-all duration-300 hover:border-rahul/50
                                      hover:text-rahulInk">
            Rahul&rsquo;s India in full →
          </Link>
        </div>

        <p className="mt-8 max-w-reading font-ui text-[11px] leading-relaxed text-muted">
          Verdict vocabulary used throughout: {(Object.keys(VERDICT) as (keyof typeof VERDICT)[])
            .map((k) => VERDICT[k].label).join(" · ")}. &ldquo;Downgrade not established&rdquo; is a
          statement about the evidence reviewed. It is not a finding that V-Dem was wrong, and
          certainly not that it was dishonest.
        </p>
      </section>
    </article>
  );
}
