import { data } from "../lib/data";

/**
 * The two eras as overlapping shapes.
 *
 * Six measures of internal-security violence, each an annual average for its
 * era. The pre-2014 decade is set to 100 on every axis and the post-2014
 * decade drawn as its share, so the inner shape is the reduction — a smaller
 * polygon means less violence.
 */
const SIZE = 400;
const C = SIZE / 2;
const R = 128;

export function SecurityRadar() {
  const ax = data.securityRadar.axes;
  const n = ax.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (Math.min(v, 100) / 100) * R;
    return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
  };
  const poly = (vals: number[]) =>
    vals.map((v, i) => pt(i, v).join(",")).join(" ");

  // Both eras share one scale, so each polygon's shape carries information:
  // where violence sat in that decade, not merely how much it fell.
  const pre = poly(ax.map((a) => a.preIndex));
  const post = poly(ax.map((a) => a.postIndex2));
  const mean = Math.round(ax.reduce((s, a) => s + a.change, 0) / n);

  return (
    <figure>
      <div className="flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[400px]" role="img"
             aria-label={`Six measures of internal-security violence, both decades on one scale. Annual averages before and after 2014: ${ax.map((a) => `${a.axis} ${a.pre} then ${a.post}`).join("; ")}. Mean reduction ${Math.abs(mean)} per cent.`}>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon key={f} points={poly(ax.map(() => f * 100))}
                     className="fill-none stroke-border" strokeWidth={1} />
          ))}
          {ax.map((_, i) => {
            const [x, y] = pt(i, 100);
            return <line key={i} x1={C} y1={C} x2={x} y2={y} className="stroke-border" />;
          })}

          <polygon points={pre} className="fill-rahul/[0.14] stroke-rahul" strokeWidth={2}
                   strokeLinejoin="round" />
          <polygon points={post} className="fill-modi/20 stroke-modi" strokeWidth={2.5}
                   strokeLinejoin="round" />
          {ax.map((a, i) => {
            const [px, py] = pt(i, a.preIndex);
            const [qx, qy] = pt(i, a.postIndex2);
            return (
              <g key={a.axis}>
                <circle cx={px} cy={py} r={3.5} className="fill-rahul" />
                <circle cx={qx} cy={qy} r={3.5} className="fill-modi" />
              </g>
            );
          })}

          {ax.map((a, i) => {
            const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
            const lx = C + (R + 34) * Math.cos(ang);
            const ly = C + (R + 34) * Math.sin(ang);
            const anchor = Math.abs(Math.cos(ang)) < 0.3 ? "middle" : Math.cos(ang) > 0 ? "start" : "end";
            return (
              <g key={a.axis}>
                <text x={lx} y={ly - 5} textAnchor={anchor} className="fill-muted" fontSize={10}
                      style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: ".08em" }}>
                  {a.axis.toUpperCase()}
                </text>
                <text x={lx} y={ly + 10} textAnchor={anchor} className="fill-modiInk" fontSize={13}
                      style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {a.change.toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2
                      font-ui text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rahul/70" /> 2004–2013
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-modi/70" /> 2014–2024
        </span>
        <span>annual averages, one scale</span>
      </div>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {ax.map((a) => (
          <li key={a.axis} className="flex items-baseline gap-3 py-2">
            <span className="min-w-0 flex-1 truncate font-ui text-[12px]">{a.axis}</span>
            <span className="num text-[11px] text-muted">
              {a.pre.toLocaleString()} → {a.post.toLocaleString()}/yr
            </span>
            <span className="num w-12 text-right text-[12px] text-modiInk">
              {a.change.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>

    </figure>
  );
}
