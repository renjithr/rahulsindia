import raw from "./everyday.json";

export type EverydayItem = {
  id: string; name: string; category: string; higherIsBetter: boolean;
  v2005: number; v2015: number; v2023: number;
  rawEarlier: number; rawLater: number;
  normEarlier: number; normLater: number;
  group: "later" | "earlier" | "comparable";
  leadType: string | null;
  marginPct: number | null;
};

export type Everyday = {
  title: string; subtitle: string; label: string;
  counts: { total: number; later: number; earlier: number; comparable: number };
  periods: { earlier: string; later: string; earlierYears: number; laterYears: number };
  method: { higher: string; lower: string; threshold: string; caution: string };
  items: EverydayItem[];
};

export const everyday = raw as unknown as Everyday;

export const byGroup = (g: EverydayItem["group"]) =>
  everyday.items.filter((i) => i.group === g);

/** Category clusters, in the order they read best. */
export const CLUSTERS = [
  "Healthcare access", "Maternal health", "Maternal nutrition", "Maternal and child health",
  "Women's health", "Women's nutrition", "Women's safety",
  "Child health", "Child nutrition", "Public healthcare", "Social development",
];
