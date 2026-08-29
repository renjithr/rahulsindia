import raw from "./data.json";
import type { Dataset, Indicator, Untestable } from "./types";

export const data = raw as unknown as Dataset;
export const all: Indicator[] = [...data.tier1, ...data.tier2];
export const byId = (id: number) => all.find((i) => i.id === id);
export const untestable: Untestable[] = data.untestable;
export const untestableById = (id: number) => untestable.find((u) => u.id === id);

/** Tier 1 first, significant first, then by absolute effect size. */
export const ordered: Indicator[] = [...all].sort((a, b) => {
  if (a.tier !== b.tier) return a.tier - b.tier;
  if (a.significant !== b.significant) return a.significant ? -1 : 1;
  if (a.p !== null && b.p !== null && a.p !== b.p) return a.p - b.p;
  return Math.abs(b.gapPct) - Math.abs(a.gapPct);
});

export const COUNTRY: Record<string, string> = {
  ARG:"Argentina", BGD:"Bangladesh", BOL:"Bolivia", BRA:"Brazil", CHN:"China", CIV:"Côte d'Ivoire",
  COL:"Colombia", ECU:"Ecuador", EGY:"Egypt", ETH:"Ethiopia", GHA:"Ghana", GTM:"Guatemala",
  HND:"Honduras", IDN:"Indonesia", IND:"India", JOR:"Jordan", KEN:"Kenya", KHM:"Cambodia",
  LKA:"Sri Lanka", MAR:"Morocco", MEX:"Mexico", MMR:"Myanmar", MYS:"Malaysia", NGA:"Nigeria",
  NPL:"Nepal", PAK:"Pakistan", PER:"Peru", PHL:"Philippines", SEN:"Senegal", THA:"Thailand",
  TUN:"Tunisia", TUR:"Türkiye", TZA:"Tanzania", UGA:"Uganda", VNM:"Vietnam", ZAF:"South Africa",
};
