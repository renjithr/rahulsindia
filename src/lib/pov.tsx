import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { data } from "./data";

export type Pov = "rahul" | "modi";

/**
 * Which India the site is speaking from.
 *
 * Every figure on the site is one comparison; the perspective decides which
 * side is the reference point and which is being described. Rahul's view puts
 * Modi's India at the origin and reports the counterfactual as a shortfall;
 * Modi's view inverts both.
 */
type Ctx = {
  pov: Pov;
  other: Pov;
  toggle: () => void;
  /** Whose name leads the site. */
  subject: string;
  otherSubject: string;
  /** The headline claim from the current side. */
  verdict: { lead: string; eco: string; sec: string; verb: string };
  /** Marker placement, in gap-percent along each axis, for the side away from centre. */
  point: { sec: number; eco: number };
  centreLabel: string;
  pointLabel: string;
  /** Hero photograph for the side currently being spoken from. */
  hero: { src: string; alt: string; caption: string };
};

const PovContext = createContext<Ctx | null>(null);

export function PovProvider({ children }: { children: ReactNode }) {
  const [pov, setPov] = useState<Pov>("rahul");
  const value = useMemo<Ctx>(() => {
    const q = data.quadrant;
    const ecoGap = q.economy.gapPct;      // Modi minus Rahul, positive = Modi richer
    const secGap = q.security.gapPct;     // Modi minus Rahul, negative = Modi safer
    const rahul = pov === "rahul";
    return {
      pov,
      other: rahul ? "modi" : "rahul",
      toggle: () => setPov((p) => (p === "rahul" ? "modi" : "rahul")),
      subject: rahul ? "Rahul’s India" : "Modi’s India",
      otherSubject: rahul ? "Modi’s India" : "Rahul’s India",
      verdict: rahul
        ? { lead: "Rahul’s India would have been", verb: "would have been",
            eco: `${Math.abs(ecoGap).toFixed(0)}% poorer`,
            sec: `${Math.abs(secGap).toFixed(0)}% less secure` }
        : { lead: "Modi’s India is", verb: "is",
            eco: `${Math.abs(ecoGap).toFixed(0)}% richer`,
            sec: `${Math.abs(secGap).toFixed(0)}% safer` },
      // Rahul's view: Modi at centre, Rahul plotted poorer and less secure.
      // Modi's view: Rahul at centre, Modi plotted richer and safer.
      point: rahul
        ? { sec: secGap, eco: -ecoGap }
        : { sec: -secGap, eco: ecoGap },
      centreLabel: rahul ? "Modi’s India" : "Rahul’s India",
      pointLabel: rahul ? "Rahul’s projected India" : "Modi’s India",
      hero: rahul
        ? { src: "img/hero.jpg",
            alt: "Rahul Gandhi speaking at a podium before the Red Fort, New Delhi",
            caption: "Counterfactual scenario. The estimated path is built from comparator countries, not from any individual’s stated policy programme." }
        : { src: "img/modi.jpg",
            alt: "Narendra Modi speaking at a podium before the Red Fort, New Delhi",
            caption: "The India that actually happened, measured against the estimated alternative." },
    };
  }, [pov]);
  return <PovContext.Provider value={value}>{children}</PovContext.Provider>;
}

export function usePov() {
  const c = useContext(PovContext);
  if (!c) throw new Error("usePov must be used inside PovProvider");
  return c;
}
