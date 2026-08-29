import { Link } from "react-router-dom";
import type { Side } from "./Sectors";

/**
 * Jump to the same argument read from the other side.
 *
 * Tinted for the destination, not the page it sits on — the reader is being
 * offered Rahul's India, so the control is blue on the Modi page and orange on
 * the Rahul page. Same convention as the perspective switch in the header.
 */
export function SwitchSide({ to }: { to: Side }) {
  const modi = to === "modi";
  const subject = modi ? "Modi’s India" : "Rahul’s India";

  return (
    <Link
      to={modi ? "/modi" : "/read"}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-5 py-3
                  font-ui text-sm font-semibold transition-all duration-300 ease-out
                  hover:-translate-y-0.5 ${
        modi
          ? "border-modi/40 bg-modi/10 text-modiInk hover:border-modi hover:bg-modi/[0.16]"
          : "border-rahul/40 bg-rahul/10 text-rahulInk hover:border-rahul hover:bg-rahul/[0.16]"
      }`}>
      <span aria-hidden="true"
            className={`inline-block h-2 w-2 rounded-full ${modi ? "bg-modi" : "bg-rahul"}`} />
      Switch to {subject}
      <span aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
    </Link>
  );
}

/** The same control with the line of context the page columns have room for. */
export function SwitchSideBlock({ to }: { to: Side }) {
  const modi = to === "modi";
  return (
    <div className="mt-10 border-t border-border pt-8">
      <p className="eyebrow mb-3">The same comparison, the other way round</p>
      <p className="mb-5 max-w-reading font-ui text-[13px] leading-relaxed text-muted">
        {modi
          ? "Every figure here is Rahul’s India measured against the India that actually happened. Read from the other direction, the same numbers describe what changed after 2014."
          : "Every figure here is the India that actually happened, measured against the estimated alternative. Read from the other direction, the same numbers describe what that alternative would have cost."}
      </p>
      <SwitchSide to={to} />
    </div>
  );
}
