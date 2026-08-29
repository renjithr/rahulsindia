export type Point = { year: number; actual: number | null; synth: number | null };
export type Weight = { c: string; w: number };

export type Indicator = {
  id: number; title: string; variable: string; source: "DIRECT" | "PROXY";
  category: string; unit: string; lowerIsBetter: boolean;
  preWindow: string; postWindow: string; donors: number;
  fit: number; tier: 1 | 2;
  congress2013: number; rahul: number; modi: number;
  gapPct: number; verdict: "BEAT" | "MISS";
  p: number | null; q?: number | null; rank: string | null; significant: boolean;
  weights: Weight[]; series: Point[]; note: string;
  related?: Related[];
  observed?: Observed[]; sourceFamily?: string; unitLabel?: string;
  verdictSide: "modi" | "rahul"; basis: "counterfactual";
  set: "core50" | "development";
  donorNote?: {
    country: string; here: number; zeroOn: number; total: number;
    best: { title: string; w: number }[];
  };
};

export type Related = {
  title: string; variable: string; unit: string; lowerIsBetter: boolean;
  fit: number; rahul: number; modi: number; gapPct: number;
  p: number | null; rank: string | null; series: Point[];
};

export type Observed = {
  year: number; value: number | null; status: string; period: string; unitMismatch: boolean;
};

export type ObservedChange = {
  side: "modi" | "rahul"; base: number; latest: number;
  baseYear: number; latestYear: number; changePct: number | null; fromZero: boolean;
};

export type Peers = {
  years: number[]; series: Record<string, (number | null)[]>;
  growthPc: Record<string, number>; rank: number; n: number; unit: string;
};

export type Untestable = {
  id: number; title: string; kind: string; reason: string;
  category: string; unit: string; sourceFamily: string; indicatorNote: string;
  lowerIsBetter: boolean; observed: Observed[];
  verdictSide: "modi" | "rahul" | "none";
  observedChange: ObservedChange | null;
  basis: "observed" | "peers";
  peers?: Peers;
  set: "core50" | "development" | "security";
  annual?: { year: number; value: number | null }[];
};

export type QuadrantAxis = {
  label: string; measure: string; source: string; unitLabel?: string;
  synth: number; actual: number; gapPct: number;
  /** null where the figure is arithmetic rather than an estimate. */
  fit: number | null; donors: number | null; end: number;
  rank: string | null; p: number | null;
  weights: Weight[]; series: Point[];
};

export type QuadrantAxisSecurity = QuadrantAxis & {
  indeterminate: boolean;
  variants: { spec: string; gapPct: number; fit: number | null }[];
  rangeLow: number; rangeHigh: number;
  /** Plotted position is the cross-country estimate; variants disagree. */
  basis: "arithmetic" | "estimated";
  assumption: string | null;
  variantsNote: string;
  null: boolean;
  measuredGapPct: number; measuredRank: string | null; measuredP: number | null;
};

export type QuadrantData = {
  economy: QuadrantAxis; security: QuadrantAxisSecurity;
  trajectory: { year: number; sec: number; eco: number }[];
};

export type Dataset = {
  meta: {
    built: string; treatmentYear: number; method: string; caveat: string;
    sources: string[]; donorPool: string[];
  };
  tier1: Indicator[]; tier2: Indicator[]; untestable: Untestable[];
  quadrant: QuadrantData;
  securitySeries: {
    points: { year: number; total: number; civilians: number; jk: number; lwe: number; ne: number }[];
    preMean: number; postMean: number; peakYear: number; peak: number;
    periods: { label: string; mean: number; era: "pre" | "post" }[];
    shifts: { at: string; pct: number; era: "pre" | "post" }[];
    firstTermChange: number; secondTermChange: number;
  };
  robustness: {
    baseline: { gap: number; fit: number; donors: number };
    placebo2009: { gap: number; fit: number; donors: number; realGapSameHorizon: number };
    leaveOneOut: { dropped: string; gap: number; fit: number }[];
    looRange: [number, number];
    oilImporterPool: { gap: number; fit: number; donors: number; excluded: string[] };
    altSourcePWT: { gap: number; fit: number; donors: number; samePoolWDI: number;
                    samePoolPWT: number; poolSize: number; note: string };
    securityVariants: Record<string, number | string | null>;
  };
  modiPage: {
    title: string;
    eco: QuadrantAxis; sec: QuadrantAxisSecurity;
    themes: {
      theme: string; chart: "line" | "bars"; why: string;
      items: {
        id: number; title: string; unit: string; lower: boolean;
        kind: "measured" | "observed"; gap: number; rahul: number; modi: number;
        series: { year: number; a: number | null; r: number | null }[];
        obs?: { year: number; v: number | null }[];
      }[];
    }[];
  };
  securityRadar: {
    axes: { axis: string; pre: number; post: number; postIndex: number;
             preIndex: number; postIndex2: number; change: number }[];
    scaleMax: number;
    note: string;
  };
  composite: {
    years: number[]; n: number;
    lines: { title: string; domain: string; pts: { year: number; v: number }[] }[];
    medians: Record<string, { year: number; v: number }[]>;
    all: { year: number; v: number }[];
  };
  securityDecade: {
    rows: { label: string; decade: number; recent: number }[];
    decadeMean: number; recentMean: number;
  };
  breakAnalysis: {
    id: number; title: string; p: number; rank: string; gap: number;
    onset: number | null; fit: number; preSlope: number | null; postSlope: number | null;
    unit: string; set: string;
  }[];
};
