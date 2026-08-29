import type { QuadrantData } from "../lib/types";
import { usePov } from "../lib/pov";

/**
 * Two markers, one frame.
 *
 * Modi's India sits at the origin because every gap on this site is measured
 * against it. Rahul's projected India sits at its offset — right means safer,
 * up means richer. The horizontal whisker is the range across three defensible
 * transforms of the conflict series, which disagree on sign, so the security
 * position is bounded rather than pinned.
 */
const W = 600, H = 372;
const PAD = { t: 34, r: 46, b: 48, l: 50 };
const SEC = 80, ECO = 20;

export function Quadrant({ data }: { data: QuadrantData }) {
  const { pov, centreLabel, pointLabel, point, otherSubject, standing } = usePov();
  const rahulView = pov === "rahul";
  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const x = (v: number) => PAD.l + ((clamp(v, SEC) + SEC) / (2 * SEC)) * iw;
  const y = (v: number) => PAD.t + ((ECO - clamp(v, ECO)) / (2 * ECO)) * ih;
  const cx = x(0), cy = y(0);

  const rSec = point.sec;
  const rEco = point.eco;

  const quads = [
    { name: "Richer, secure",      qx: 0.75, qy: 0.22 },
    { name: "Richer, less secure", qx: 0.25, qy: 0.22 },
    { name: "Poorer but secure",   qx: 0.75, qy: 0.86 },
    { name: "Poorer, less secure", qx: 0.25, qy: 0.86 },
  ];

  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[600px]" role="img"
             aria-label={`Modi's India sits at the origin. Rahul's projected India is ${Math.abs(rEco).toFixed(0)} per cent ${rEco > 0 ? "richer" : "poorer"} and ${Math.abs(rSec).toFixed(0)} per cent less secure, calculated from pre-2014 against post-2014 security totals.`}>
          <rect x={PAD.l} y={cy} width={iw} height={ih / 2} className="fill-rahul/[0.05]" />
          <rect x={PAD.l} y={PAD.t} width={iw} height={ih} className="fill-none stroke-border" />
          <line x1={cx} y1={PAD.t} x2={cx} y2={PAD.t + ih} className="stroke-border" />
          <line x1={PAD.l} y1={cy} x2={PAD.l + iw} y2={cy} className="stroke-border" />

          {quads.map((q) => (
            <text key={q.name} x={PAD.l + iw * q.qx} y={PAD.t + ih * q.qy} textAnchor="middle"
                  className="fill-ink font-display" fontSize={13}
                  opacity={q.qy > 0.5 ? 0.8 : 0.32}>{q.name}</text>
          ))}

          {/* Modi's India — the reference point */}
          <circle cx={cx} cy={cy} r={6.5} className={rahulView ? "fill-modi" : "fill-rahul"} />
          <circle cx={cx} cy={cy} r={11} strokeWidth={1.2} opacity={0.35}
                  className={rahulView ? "fill-none stroke-modi" : "fill-none stroke-rahul"} />
          <text x={cx} y={cy - 18} textAnchor="middle" fontSize={12} fontWeight={700}
                className={`font-display ${rahulView ? "fill-modiInk" : "fill-rahulInk"}`}>
            {centreLabel}
          </text>

          {/* Rahul's projected India */}
          <circle cx={x(rSec)} cy={y(rEco)} r={6.5} className={rahulView ? "fill-rahul" : "fill-modi"} />
          <circle cx={x(rSec)} cy={y(rEco)} r={11} strokeWidth={1.2} opacity={0.35}
                  className={rahulView ? "fill-none stroke-rahul" : "fill-none stroke-modi"} />
          <text x={x(rSec)} y={y(rEco) + 27} textAnchor="middle" fontSize={12} fontWeight={700}
                className={`font-display ${rahulView ? "fill-rahulInk" : "fill-modiInk"}`}>
            {pointLabel}
          </text>
          <text x={x(rSec)} y={y(rEco) + 40} textAnchor="middle" className="fill-muted" fontSize={8.5}
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".06em" }}>
            DECADE TOTALS, 2004–14 vs 2014–24
          </text>

          <text x={PAD.l} y={H - 26} className="fill-muted" fontSize={9}
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".07em" }}>
            {`← LESS SECURE THAN ${otherSubject.split("’s")[0]}`}
          </text>
          <text x={PAD.l + iw} y={H - 26} textAnchor="end" className="fill-muted" fontSize={9}
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".07em" }}>
            {`MORE SECURE THAN ${otherSubject.split("’s")[0]} →`}
          </text>
          <text transform={`rotate(-90 14 ${PAD.t})`} x={14} y={PAD.t} className="fill-muted" fontSize={9}
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".07em" }}>
            {`← RICHER THAN ${otherSubject.split("’s")[0]}`}
          </text>
          <text transform={`rotate(-90 14 ${PAD.t + ih})`} x={14} y={PAD.t + ih} textAnchor="end"
                className="fill-muted" fontSize={9}
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".07em" }}>
            {`POORER THAN ${otherSubject.split("’s")[0]} →`}
          </text>
        </svg>
      </div>



      <dl className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        {([data.economy, data.security] as const).map((d) => (
          <div key={d.label}>
            <p className="eyebrow">{d.label} · {d.measure}</p>
            <p className="num mt-1 text-3xl">
              <span className="text-rahulInk">
                {d.synth.toLocaleString(undefined, { maximumFractionDigits: d.synth < 10 ? 3 : 0 })}
              </span>
              <span className="mx-2 text-muted">vs</span>
              <span className="text-modiInk">
                {d.actual.toLocaleString(undefined, { maximumFractionDigits: d.actual < 10 ? 3 : 0 })}
              </span>
            </p>
            <p className="mt-1.5 font-ui text-[11px] leading-relaxed text-muted">
              {d.unitLabel ? `${d.unitLabel} · ` : "Rahul vs Modi · "}
              {d.fit !== null
                ? <>pre-2014 fit {d.fit.toFixed(1)}% · {d.donors} donors · rank {d.rank ?? "—"}
                   {d.p !== null ? ` · p = ${d.p.toFixed(3)}` : ""}</>
                : "arithmetic on observed totals — no counterfactual, no placebo test"}
            </p>
          </div>
        ))}
      </dl>

      <p className={`mt-8 max-w-[18ch] font-display text-3xl font-bold leading-[1.15]
                     tracking-tight sm:text-4xl ${rahulView ? "text-rahulInk" : "text-modiInk"}`}>
        {standing}
      </p>
    </figure>
  );
}
