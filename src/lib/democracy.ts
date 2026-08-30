/**
 * India's V-Dem Electoral Democracy Index, and an audit of what sits beneath it.
 *
 * Two kinds of number live here and must never be conflated:
 *   - published V-Dem values (EDI, Expression, Association, Elected Officials,
 *     Suffrage), taken from the governance panel;
 *   - Clean Elections, which the panel does not carry. It is reconstructed from
 *     V-Dem's published EDI formula and is flagged `derived` everywhere it
 *     appears, so a reader can discount it.
 *
 * Nothing here is an assertion about intent. The verdict vocabulary tops out at
 * "the comparative evidence reviewed does not establish this", which is a claim
 * about evidence, not about motive.
 */

export type Verdict =
  | "NOT_ESTABLISHED" | "MIXED" | "SUPPORTED"
  | "IMPROVEMENT" | "NO_CHANGE" | "NOT_AUDITED";

export const VERDICT: Record<Verdict, {
  label: string; description: string; tone: string; dot: string; mark: string;
}> = {
  NOT_ESTABLISHED: {
    label: "Downgrade not established",
    description: "The comparative evidence reviewed does not demonstrate deterioration from the earlier baseline.",
    tone: "border-rahul/35 bg-rahul/[0.06] text-rahulInk", dot: "bg-rahul", mark: "=",
  },
  MIXED: {
    label: "Mixed evidence",
    description: "There is evidence supporting concern, but comparable contrary evidence or an incomplete baseline prevents a strong conclusion.",
    tone: "border-amber-600/35 bg-amber-500/[0.08] text-amber-800", dot: "bg-amber-600", mark: "~",
  },
  SUPPORTED: {
    label: "Some deterioration supported",
    description: "Comparable evidence indicates a meaningful post-2014 deterioration.",
    tone: "border-accent/35 bg-accent/[0.06] text-accent", dot: "bg-accent", mark: "↓",
  },
  IMPROVEMENT: {
    label: "Observable improvement",
    description: "Relevant objective measures improved rather than deteriorated.",
    tone: "border-emerald-700/35 bg-emerald-600/[0.07] text-emerald-800", dot: "bg-emerald-700", mark: "↑",
  },
  NO_CHANGE: {
    label: "No material deterioration",
    description: "The relevant institution or condition remained broadly unchanged.",
    tone: "border-border bg-ink/[0.03] text-ink/75", dot: "bg-muted", mark: "–",
  },
  NOT_AUDITED: {
    label: "Audit pending",
    description: "We have not yet completed a sufficiently rigorous pre/post comparison.",
    tone: "border-border bg-background text-muted", dot: "bg-border", mark: "?",
  },
};

/* ── the published series ─────────────────────────────────────────────── */

export type YearRow = {
  year: number; electoralDemocracy: number;
  freedomExpression: number; freedomAssociation: number;
  cleanElections: number; cleanElectionsDerived: boolean;
  electedOfficials: number; suffrage: number;
  additivePolyarchy: number; multiplicativePolyarchy: number;
};

export const years: YearRow[] = [
  { year: 2010, electoralDemocracy: 0.671, freedomExpression: 0.889, freedomAssociation: 0.787,
    cleanElections: 0.708687, cleanElectionsDerived: true, electedOfficials: 1.0, suffrage: 1.0,
    additivePolyarchy: 0.846172, multiplicativePolyarchy: 0.495828 },
  { year: 2014, electoralDemocracy: 0.617, freedomExpression: 0.812, freedomAssociation: 0.769,
    cleanElections: 0.673297, cleanElectionsDerived: true, electedOfficials: 1.0, suffrage: 1.0,
    additivePolyarchy: 0.813574, multiplicativePolyarchy: 0.420426 },
  { year: 2023, electoralDemocracy: 0.374, freedomExpression: 0.422, freedomAssociation: 0.597,
    cleanElections: 0.484625, cleanElectionsDerived: true, electedOfficials: 1.0, suffrage: 1.0,
    additivePolyarchy: 0.625906, multiplicativePolyarchy: 0.122094 },
];

export const at = (y: number) => years.find((r) => r.year === y)!;

export const periodChanges = {
  "2010_to_2014": { electoralDemocracy: -0.054, freedomExpression: -0.077,
                    freedomAssociation: -0.018, cleanElections: -0.03539 },
  "2014_to_2023": { electoralDemocracy: -0.243, freedomExpression: -0.390,
                    freedomAssociation: -0.172, cleanElections: -0.188672 },
};

/** V-Dem's published aggregation. Half the index is a product, not a sum. */
export function edi(c: {
  expression: number; association: number; clean: number;
  elected: number; suffrage: number;
}) {
  const api = 0.25 * c.association + 0.25 * c.clean + 0.25 * c.expression
            + 0.125 * c.elected + 0.125 * c.suffrage;
  const mpi = c.association * c.clean * c.expression * c.elected * c.suffrage;
  return { api, mpi, edi: 0.5 * api + 0.5 * mpi };
}

export const components = [
  { key: "expression",  name: "Freedom of Expression",   v2010: 0.889,    v2014: 0.812,    v2023: 0.422,    fell: true,  change: -0.390 },
  { key: "clean",       name: "Clean Elections",         v2010: 0.708687, v2014: 0.673297, v2023: 0.484625, fell: true,  change: -0.188672, derived: true },
  { key: "association", name: "Freedom of Association",  v2010: 0.787,    v2014: 0.769,    v2023: 0.597,    fell: true,  change: -0.172 },
  { key: "elected",     name: "Elected Officials",       v2010: 1.0,      v2014: 1.0,      v2023: 1.0,      fell: false, change: 0 },
  { key: "suffrage",    name: "Universal Suffrage",      v2010: 1.0,      v2014: 1.0,      v2023: 1.0,      fell: false, change: 0 },
] as const;

/* ── objective series used in the audit ───────────────────────────────── */

export const pollingStations = [
  { election: 2009, count: 830866 },
  { election: 2014, count: 927553 },
  { election: 2019, count: 1037848 },
];

export const vvpat = {
  2009: "No nationwide paper audit trail",
  2014: "Limited deployment",
  2019: "Deployed at every polling station",
  unitsAvailable2019: 1740000,
};

export const partyParticipation = [
  { year: 2009, parties: 363 },
  { year: 2014, parties: 464 },
  { year: 2019, parties: 673 },
];

export const mediaTimeline = [
  { year: 2008, place: "Jammu & Kashmir", event: "Local television channels prohibited from broadcasting news and current-affairs material for nine days.", status: "implemented", actor: "state" },
  { year: 2008, place: "Jammu", event: "Two local TV channels ordered off air; the High Court subsequently allowed them to resume.", status: "reversed", actor: "state" },
  { year: 2010, place: "Kashmir", event: "Local cable news and current-affairs broadcasts banned again; channels restricted.", status: "implemented", actor: "state" },
  { year: 2014, place: "Uttar Pradesh", event: "Times Now and India News disappeared from UP cable networks after negative reporting about the state government. Operators reported calls from ‘higher-ups’ — an allegation, not an established order.", status: "alleged", actor: "state" },
  { year: 2016, place: "Union", event: "NDTV India received a one-day shutdown order over Pathankot coverage. The government put the order on hold before any blackout occurred.", status: "not-implemented", actor: "union" },
  { year: 2020, place: "Union", event: "Asianet News and MediaOne received 48-hour bans over Delhi-riot coverage. Both returned early after the restrictions were revoked.", status: "implemented", actor: "union" },
  { year: 2022, place: "Union", event: "MediaOne’s uplinking permission revoked after denial of security clearance.", status: "implemented", actor: "union" },
  { year: 2023, place: "Supreme Court", event: "The Court rejected a channel’s critical or ‘anti-establishment’ views as a legitimate basis to restrict press freedom.", status: "reversed", actor: "court" },
] as const;

export const fcra = {
  2010: {
    title: "FCRA 2010", subtitle: "Structural regime change",
    items: [
      "Replaced the earlier regime with what the Supreme Court later called a more stringent dispensation",
      "Five-year validity and periodic renewal of registration",
      "Substantial suspension, cancellation and compliance machinery",
      "Statutory administrative-expense ceiling of 50%",
      "Regulation of organisations considered political in nature",
      "Expanded monitoring and reporting",
    ],
  },
  2020: {
    title: "FCRA 2020", subtitle: "Further tightening of the same architecture",
    items: [
      "Complete prohibition on transferring foreign contribution to another person or NGO",
      "Administrative-expense ceiling cut from 50% to 20%",
      "Receipt required through a designated SBI New Delhi Main Branch account",
      "Additional identity requirements",
      "Parts of the existing regime made more stringent",
    ],
  },
  cancellations: [
    { period: "2012", count: "4,138", note: "registrations cancelled for failure to submit annual returns" },
    { period: "FY2014-15 to FY2016-17", count: "10,000+", note: "cancelled, mainly for non-filing of mandatory returns" },
    { period: "since 2014, to early 2018", count: "14,938", note: "cancellations reported by government" },
  ],
};

/* ── the audit itself ─────────────────────────────────────────────────── */

export type Indicator = {
  id: string; vdem: string; name: string; verdict: Verdict;
  status?: "AUDITED" | "PARTIAL" | "NOT_AUDITED";
  question?: string;
  pre?: string[]; post?: string[]; facts?: string[];
  conclusion?: string; caveat?: string; expertSynthesis?: boolean;
  sources?: string[];
};

export type Section = {
  key: "expression" | "clean" | "association";
  name: string; vdem: string; verdict: Verdict; headline: string;
  v2010: number; v2014: number; v2023: number;
  indicators: Indicator[];
};

export const sections: Section[] = [
  {
    key: "expression", name: "Freedom of Expression", vdem: "v2x_freexp_altinf",
    verdict: "NOT_ESTABLISHED", v2010: 0.889, v2014: 0.812, v2023: 0.422,
    headline: "A very large post-2014 decline is recorded, but the comparative factual audit is incomplete, and the broadcast-censorship evidence checked so far does not establish a post-2014 deterioration.",
    indicators: [
      {
        id: "media_censorship", vdem: "v2mecenefm", name: "Government censorship effort — media",
        verdict: "NOT_ESTABLISHED", status: "AUDITED",
        question: "Does government directly or indirectly attempt to censor print or broadcast media?",
        pre: [
          "2008 — J&K authorities prohibited local television news and current-affairs broadcasts for nine days.",
          "2008 — Two Jammu local TV channels ordered off air; the High Court later allowed them to resume.",
          "2010 — Local cable news broadcasts banned again in Kashmir; channels restricted.",
          "2014 — Times Now and India News disappeared from UP cable networks after critical reporting on the state government. Operators reported calls from ‘higher-ups’ (allegation).",
        ],
        post: [
          "2016 — NDTV India received a one-day shutdown order over Pathankot coverage. The order was put on hold; the channel never went off air.",
          "2020 — Asianet News and MediaOne received 48-hour bans over Delhi-riot coverage. Both went off air, and both returned early when the restrictions were revoked.",
          "2022 — MediaOne’s uplinking permission revoked on denial of security clearance. The channel went off air; the Supreme Court later rejected ‘anti-establishment’ views as a basis to restrict press freedom.",
        ],
        conclusion: "Government interference with broadcasting is real in both periods. The cases reviewed do not establish that direct political interference with news broadcasting became clearly more frequent after 2014, so post-2014 incidents alone cannot justify a comparative downgrade from the pre-2014 baseline.",
        caveat: "V-Dem's censorship indicator also covers indirect mechanisms — licensing, financial pressure, other interference. We have not completed a comprehensive quantitative audit of every such mechanism.",
        sources: ["JK_MEDIA_2008", "UP_MEDIA_2014", "MEDIA_BAN_2020", "MEDIAONE_SC_2023"],
      },
      { id: "journalist_harassment", vdem: "v2meharjrn", name: "Harassment of journalists", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      { id: "media_self_censorship", vdem: "v2meslfcen", name: "Media self-censorship", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      { id: "media_bias", vdem: "v2mebias", name: "Media bias", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      {
        id: "media_critical", vdem: "v2mecrit", name: "Print/broadcast media critical of government",
        verdict: "MIXED", status: "PARTIAL",
        facts: [
          "Critical media continued to exist and operate in both periods.",
          "The 2020 MediaOne and Asianet orders and the 2022 MediaOne litigation show that government action against critical coverage did occur.",
          "Comparable politically connected broadcast restrictions also occurred before 2014.",
        ],
        conclusion: "The existence of criticism is clear in both periods. A systematic quantitative comparison has not yet been completed.",
      },
      { id: "media_perspectives", vdem: "v2merange", name: "Range of print/broadcast media perspectives", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      { id: "discussion_men", vdem: "v2cldiscm", name: "Freedom of political discussion — men", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      { id: "discussion_women", vdem: "v2cldiscw", name: "Freedom of political discussion — women", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
      { id: "academic_cultural", vdem: "v2clacfree", name: "Academic and cultural expression", verdict: "NOT_AUDITED", status: "NOT_AUDITED" },
    ],
  },
  {
    key: "clean", name: "Clean Elections", vdem: "v2xel_frefair",
    verdict: "NOT_ESTABLISHED", v2010: 0.708687, v2014: 0.673297, v2023: 0.484625,
    headline: "Several measurable election-administration indicators improved after 2014, while genuine concerns existed in both eras. The comparative evidence reviewed does not establish the magnitude of the Clean Elections downgrade.",
    indicators: [
      {
        id: "emb_autonomy", vdem: "v2elembaut", name: "Election Management Body autonomy",
        verdict: "NOT_ESTABLISHED", status: "AUDITED",
        pre: [
          "Before 2023 there was no bipartisan statutory selection committee for Election Commissioners.",
          "Appointments were effectively made through the executive process led by the Prime Minister's government.",
          "2009 — CEC N. Gopalaswami recommended removal of Election Commissioner Navin Chawla over alleged partisan conduct.",
          "The UPA government rejected that recommendation, and Chawla subsequently became CEC.",
        ],
        post: [
          "The executive appointment structure remained broadly the same through the 2019 election.",
          "2019 — Ashok Lavasa dissented from five clean chits involving Narendra Modi and Amit Shah; the decisions were taken 2-1.",
          "March 2023 — The Supreme Court temporarily introduced a PM + Leader of Opposition + CJI selection committee.",
          "The 2023 statute gives the Leader of Opposition a formal seat alongside the PM and a Cabinet Minister nominated by the PM.",
        ],
        conclusion: "There are legitimate 2019 concerns, but there was also a severe Election Commission partisanship controversy in 2009 under the earlier system. Formal opposition participation in appointments did not exist in the pre-2014 system and exists today. A substantial autonomy downgrade is not established by institutional comparison alone.",
        caveat: "The current statutory committee gives the government a 2-1 numerical advantage, so including the opposition does not establish complete independence.",
        sources: ["ANOOP_BARANWAL", "CEC_ACT_2023", "CHAWLA_2009", "LAVASA_2019"],
      },
      {
        id: "emb_capacity", vdem: "v2elembcap", name: "Election Management Body capacity",
        verdict: "IMPROVEMENT", status: "AUDITED",
        facts: [
          "Polling stations administered: 830,866 in 2009, 927,553 in 2014, 1,037,848 in 2019.",
          "VVPAT: not deployed nationally in 2009, limited in 2014, at every polling station in 2019.",
          "17.40 lakh VVPAT units available in 2019.",
        ],
        conclusion: "Observable operational capacity expanded materially. Evidence for a capacity downgrade is difficult to reconcile with these objective improvements unless V-Dem identifies different countervailing capacity failures.",
        sources: ["ECI_ABOUT", "ECI_VVPAT"],
      },
      {
        id: "voter_registry", vdem: "v2elrgstry", name: "Voter registry quality",
        verdict: "NOT_ESTABLISHED", status: "AUDITED",
        pre: [
          "The 2014 election had major voter-roll deletion controversies.",
          "The Election Commission publicly acknowledged problems.",
          "An estimated 1.5 to 2 lakh people were reportedly turned away in Mumbai because names were missing from the rolls.",
          "The Commission subsequently contacted large numbers of deleted voters.",
        ],
        post: [
          "Complaints about electoral rolls continued.",
          "Roll-cleaning and verification systems also expanded.",
        ],
        conclusion: "A nationwide quantitative comparison showing the 2019 registry was worse than the 2009 or 2014 registry has not been established. The 2014 baseline itself contained major documented failures.",
        sources: ["VOTER_ROLL_2014"],
      },
      {
        id: "vote_buying", vdem: "v2elvotbuy", name: "Vote buying",
        verdict: "MIXED", status: "AUDITED",
        post: [
          "The Election Commission recorded very large election-period seizures in 2019.",
          "The Vellore Lok Sabha election was rescinded after authorities found what the ECI called a systematic design to influence voters through cash inducements.",
          "₹11.48 crore in cash was found in the specific Vellore investigation cited by the ECI.",
        ],
        caveat: "Higher seizures can indicate greater malpractice, stronger enforcement, broader categories being counted, or all three. More enforcement is not the same as more misconduct.",
        conclusion: "This is one of the stronger factual bases for concern, but seizure totals alone cannot be converted directly into a comparative democracy penalty.",
        sources: ["VELLORE_2019"],
      },
      {
        id: "other_irregularities", vdem: "v2elirreg", name: "Other voting irregularities",
        verdict: "NOT_ESTABLISHED", status: "AUDITED",
        facts: [
          "2019 introduced nationwide VVPAT deployment.",
          "Equipment malfunction is not equivalent to intentional electoral fraud.",
          "Our audit has not identified evidence of systematic nationwide ballot stuffing, intentional result alteration or deliberate miscounting in 2019 at a level demonstrably worse than earlier elections.",
        ],
        conclusion: "Deterioration remains unestablished on the evidence reviewed.",
      },
      {
        id: "government_intimidation", vdem: "v2elintim", name: "Government intimidation of opposition",
        verdict: "MIXED", status: "PARTIAL",
        post: [
          "An Indian Express review found at least 15 Income Tax searches involving opposition leaders or associates during a six-month period around the 2019 election.",
          "The Election Commission instructed revenue agencies that election-period enforcement must be neutral, impartial and non-discriminatory.",
          "The Commission later expressed extreme displeasure with the Revenue Department's response.",
        ],
        conclusion: "There is genuine post-2014 evidence supporting concern. A sufficiently systematic pre-2014 election-period comparison has not been completed, so a comparative downgrade cannot yet be quantified confidently.",
        sources: ["RAIDS_2019"],
      },
      {
        id: "electoral_violence", vdem: "v2elpeace", name: "Non-state electoral violence",
        verdict: "NOT_ESTABLISHED", status: "AUDITED",
        pre: ["At least 16 people, including eight police personnel, were killed in Maoist violence during the first phase of the 2009 Lok Sabha election."],
        post: ["The 2019 election also experienced serious political violence, particularly in some states."],
        conclusion: "The evidence reviewed does not establish a clear nationwide increase from the earlier baseline.",
      },
      {
        id: "overall_free_fair", vdem: "v2elfrfair", name: "Overall election free and fair assessment",
        verdict: "MIXED", status: "PARTIAL", expertSynthesis: true,
        conclusion: "This is an expert summary judgment. It should not be presented as independent factual proof of the same conclusion that the Clean Elections index is designed to measure.",
      },
    ],
  },
  {
    key: "association", name: "Freedom of Association", vdem: "v2x_frassoc_thick",
    verdict: "NOT_ESTABLISHED", v2010: 0.787, v2014: 0.769, v2023: 0.597,
    headline: "Political-party competition remained extremely broad, while civil-society regulation tightened in some respects. The very large overall decline is not explained by the comparative evidence reviewed.",
    indicators: [
      {
        id: "party_bans", vdem: "v2psparban", name: "Party bans",
        verdict: "NO_CHANGE", status: "AUDITED",
        facts: [
          "Major opposition parties remained legal and able to contest elections before and after 2014.",
          "Congress, CPI(M), TMC, DMK, SP, BSP, AAP and other major parties continued operating.",
        ],
        conclusion: "No meaningful deterioration demonstrated.",
      },
      {
        id: "barriers_parties", vdem: "v2psbars", name: "Barriers to political parties",
        verdict: "MIXED", status: "AUDITED",
        facts: [
          "Parties participating in Lok Sabha elections: 363 in 2009, 464 in 2014, 673 in 2019.",
          "Investigative-agency activity against opposition politicians increased sharply after 2014.",
          "An Indian Express investigation found 43 of 72 prominent politicians under CBI scrutiny during UPA were opposition figures — about 60%.",
          "For the NDA period examined, 118 of 124 were opposition figures — about 95%.",
          "A similar review reported 95% of prominent politicians investigated by the ED after 2014 were from opposition parties.",
        ],
        conclusion: "Formal entry into party politics clearly did not contract — the number of participating parties rose sharply. Selective investigative pressure is a separate and real basis for concern, so this is mixed rather than exonerated.",
        sources: ["ECI_ABOUT", "CBI_CASEBOOK", "ED_CASEBOOK"],
      },
      {
        id: "opposition_autonomy", vdem: "v2psoppaut", name: "Opposition-party autonomy",
        verdict: "MIXED", status: "AUDITED",
        facts: [
          "Major opposition parties continued campaigning independently against the ruling party.",
          "Opposition parties independently governed multiple states.",
          "Parties created, changed and exited alliances; the INDIA alliance was independently organised.",
          "The sharp opposition skew in CBI and ED investigations raises legitimate concern about coercive pressure.",
        ],
        conclusion: "The proposition that India's major opposition parties ceased to be autonomous is not supported. Increased enforcement pressure is nevertheless relevant, and is shown here as counter-evidence rather than hidden.",
        sources: ["CBI_CASEBOOK", "ED_CASEBOOK"],
      },
      {
        id: "multiparty_elections", vdem: "v2elmulpar", name: "Multiparty elections",
        verdict: "IMPROVEMENT", status: "AUDITED",
        facts: ["Parties participating: 363 (2009), 464 (2014), 673 (2019)."],
        conclusion: "On the straightforward observable measure of participation, India became more — not less — multiparty. Party count alone does not prove opposition freedom.",
        sources: ["ECI_ABOUT"],
      },
      {
        id: "cso_entry_exit", vdem: "v2cseeorgs", name: "Civil-society organisation entry and exit",
        verdict: "MIXED", status: "AUDITED",
        pre: [
          "FCRA 2010 replaced the earlier regime with what the Supreme Court later described as a more stringent dispensation.",
          "It introduced five-year registration validity, a suspension and cancellation framework, a 50% administrative-expense ceiling and expanded reporting.",
          "In 2012, FCRA registrations of 4,138 associations were cancelled for failure to submit annual returns.",
        ],
        post: [
          "FCRA 2020 completely prohibited transfer of foreign contribution to another person or NGO.",
          "The administrative-expense ceiling was cut from 50% to 20%, with a designated SBI New Delhi account required.",
          "More than 10,000 NGO registrations were cancelled during FY2014-15 to FY2016-17, mainly for non-filing of returns; 14,938 cancellations were reported since 2014 by early 2018.",
        ],
        conclusion: "The 2020 amendment genuinely tightened an already restrictive regime. But the larger structural transformation occurred with FCRA 2010, and mass cancellation for compliance failure also occurred before 2014. FCRA supports some post-2014 concern without explaining a dramatically larger Association penalty.",
        sources: ["NOEL_HARPER", "FCRA_CANCEL_2012", "FCRA_POST2014"],
      },
      {
        id: "cso_repression", vdem: "v2csreprss", name: "Civil-society repression",
        verdict: "MIXED", status: "PARTIAL",
        pre: ["Peaceful activists and protesters faced sedition and other criminal cases before 2014, including major controversies around Kudankulam and other movements."],
        post: ["Civil-rights activists and organisations faced UAPA, FCRA and other enforcement actions after 2014."],
        conclusion: "Serious repression examples exist in both periods. A standardised comparative count controlling for severity, duration and legal outcome has not been completed.",
      },
    ],
  },
];

/** Flattened for the matrix, with the short pre/post summaries it displays. */
export const matrix: {
  component: string; indicator: string; pre: string; post: string;
  direction: string; verdict: Verdict;
}[] = [
  ["Expression", "Government media censorship", "Comparable serious restrictions", "Comparable serious restrictions", "No clear worsening established", "NOT_ESTABLISHED"],
  ["Expression", "Journalist harassment", "CPJ counted 3 imprisoned, Dec 2012", "CPJ counted 7 imprisoned, 2022 and 2023", "Counts not case-checked", "NOT_ESTABLISHED"],
  ["Expression", "Media self-censorship", "Documented before 2014", "Chilling effects reported", "Not directly observable", "MIXED"],
  ["Expression", "Media bias against opposition", "2014: opposition led TV visibility", "2019: ECI found DD News non-neutral", "Public broadcaster only", "MIXED"],
  ["Expression", "Major media critical of government", "Extensive critical reporting of UPA", "Extensive critical reporting continues", "No clear worsening established", "NOT_ESTABLISHED"],
  ["Expression", "Range of media perspectives", "859 private satellite channels, 2013-14", "905 channels, 2022-23", "No collapse demonstrated", "NOT_ESTABLISHED"],
  ["Expression", "Political discussion — men", "Trivedi and Mahapatra arrests, 66A cases", "Arrests and FIRs continued", "No transition established", "NOT_ESTABLISHED"],
  ["Expression", "Political discussion — women", "2012 Palghar Facebook arrests", "Cases continue; participation widespread", "No systematic worsening shown", "NOT_ESTABLISHED"],
  ["Expression", "Academic and cultural expression", "Syllabus withdrawals, book ban, artist exile", "Scholars at Risk cases; 2023 screenings", "Comparable in both periods", "NOT_ESTABLISHED"],
  ["Clean Elections", "EMB autonomy", "2009 Chawla controversy; executive appointments", "2019 Lavasa controversy; later LoP inclusion", "Large deterioration not established", "NOT_ESTABLISHED"],
  ["Clean Elections", "EMB capacity", "830,866 polling stations in 2009", "1,037,848 in 2019, plus universal VVPAT", "Improved", "IMPROVEMENT"],
  ["Clean Elections", "Voter registry", "Major 2014 deletion failures", "Problems continued", "Worsening not established", "NOT_ESTABLISHED"],
  ["Clean Elections", "Vote buying", "Existing problem", "Vellore, plus large seizures", "Possible deterioration", "MIXED"],
  ["Clean Elections", "Other irregularities", "Existing irregularities", "Universal VVPAT, plus complaints", "Worsening not established", "NOT_ESTABLISHED"],
  ["Clean Elections", "Government intimidation", "Baseline incomplete", "2019 opposition-heavy raids", "Concern exists", "MIXED"],
  ["Clean Elections", "Electoral violence", "Serious 2009 violence", "Serious 2019 violence", "No clear national worsening", "NOT_ESTABLISHED"],
  ["Clean Elections", "Overall free and fair", "Expert judgment", "Expert judgment", "Not independent evidence", "MIXED"],
  ["Association", "Party bans", "Competitive parties legal", "Competitive parties legal", "No deterioration", "NO_CHANGE"],
  ["Association", "Barriers to parties", "363 parties in 2009", "673 parties in 2019; agency pressure concern", "Mixed", "MIXED"],
  ["Association", "Opposition autonomy", "Independent opposition", "Independent opposition, plus enforcement pressure", "Mixed", "MIXED"],
  ["Association", "Multiparty elections", "363 parties in 2009", "673 parties in 2019", "Improved", "IMPROVEMENT"],
  ["Association", "CSO entry and exit", "FCRA 2010 tightening; 4,138 cancellations", "FCRA 2020 further tightening", "Mixed", "MIXED"],
  ["Association", "CSO repression", "Serious cases existed", "Serious cases exist", "Comparative worsening not established", "MIXED"],
].map(([component, indicator, pre, post, direction, verdict]) => ({
  component, indicator, pre, post, direction, verdict: verdict as Verdict,
}));

/* ── sources ──────────────────────────────────────────────────────────── */

export type Source = { id: string; publisher: string; title: string; type: string; useFor?: string[] };

export const sources: Source[] = [
  { id: "VDEM_CODEBOOK_V14", publisher: "V-Dem Institute", title: "V-Dem Codebook v14", type: "Methodology", useFor: ["EDI formula", "Clean Elections inputs", "Expression inputs", "Association inputs"] },
  { id: "VDEM_METHOD", publisher: "V-Dem Institute", title: "V-Dem Methodology", type: "Methodology", useFor: ["Country experts", "Bayesian IRT", "Coder anonymity", "Expert aggregation"] },
  { id: "VDEM_DR2021_INDIA", publisher: "V-Dem Institute", title: "Democracy Report 2021 — India", type: "V-Dem interpretation" },
  { id: "ECI_ABOUT", publisher: "Election Commission of India", title: "Historical electoral statistics", type: "Primary government", useFor: ["Polling stations", "Voter turnout", "Party participation"] },
  { id: "ECI_VVPAT", publisher: "Election Commission of India", title: "EVM and VVPAT FAQs", type: "Primary government" },
  { id: "ANOOP_BARANWAL", publisher: "Supreme Court of India", title: "Anoop Baranwal v. Union of India", type: "Court judgment", useFor: ["CEC/EC appointment history", "2023 interim committee"] },
  { id: "CEC_ACT_2023", publisher: "India Code", title: "Chief Election Commissioner and Other Election Commissioners Act, 2023", type: "Statute" },
  { id: "CHAWLA_2009", publisher: "Indian Express", title: "President rejects CEC advice, Navin Chawla stays", type: "Contemporary reporting" },
  { id: "LAVASA_2019", publisher: "Indian Express", title: "Election Commissioner Lavasa opposed five clean chits", type: "Contemporary reporting" },
  { id: "VELLORE_2019", publisher: "Election Commission / PIB", title: "Election to Vellore Parliamentary Constituency rescinded", type: "Primary government" },
  { id: "RAIDS_2019", publisher: "Indian Express", title: "Six months, fifteen raids against the Opposition", type: "Investigative reporting" },
  { id: "VOTER_ROLL_2014", publisher: "Times of India", title: "Election Commission apologises over Mumbai voter-list deletions", type: "Contemporary reporting" },
  { id: "JK_MEDIA_2008", publisher: "Hindustan Times / PTI", title: "Ban on local TV channels lifted in J&K", type: "Contemporary reporting" },
  { id: "UP_MEDIA_2014", publisher: "Times of India", title: "UP blacks out TV channels after criticism of the state government", type: "Contemporary reporting" },
  { id: "MEDIA_BAN_2020", publisher: "Kerala High Court record / Indian Express", title: "Asianet News and MediaOne 48-hour transmission orders", type: "Court record / reporting" },
  { id: "MEDIAONE_SC_2023", publisher: "Supreme Court of India", title: "Madhyamam Broadcasting Ltd v. Union of India", type: "Court judgment" },
  { id: "FCRA_CANCEL_2012", publisher: "Ministry of Home Affairs / PIB", title: "4,138 FCRA registrations cancelled in 2012", type: "Primary government" },
  { id: "FCRA_POST2014", publisher: "Ministry of Home Affairs / PIB", title: "FCRA NGO cancellations and compliance actions", type: "Primary government" },
  { id: "NOEL_HARPER", publisher: "Supreme Court of India", title: "Noel Harper v. Union of India", type: "Court judgment", useFor: ["History of FCRA 2010", "2020 amendments", "Transfer prohibition"] },
  { id: "CPJ_PRISON", publisher: "Committee to Protect Journalists", title: "Annual prison census — India", type: "NGO dataset" },
  { id: "CMS_2014", publisher: "CMS Media Lab", title: "Election campaign television coverage, 2014", type: "Media monitoring" },
  { id: "ECI_DD_2019", publisher: "Election Commission of India", title: "Analysis of Doordarshan campaign coverage, 2019", type: "Primary government" },
  { id: "MIB_CHANNELS", publisher: "Ministry of Information & Broadcasting", title: "Permitted private satellite television channels", type: "Primary government" },
  { id: "SAR_INDIA", publisher: "Scholars at Risk", title: "Free to Think — India entries", type: "NGO monitoring" },
  { id: "FH_INDIA", publisher: "Freedom House", title: "Freedom on the Net / Freedom in the World — India", type: "NGO monitoring" },
  { id: "DU_RAMANUJAN", publisher: "University of Delhi Academic Council", title: "Removal of ‘Three Hundred Ramayanas’ from the BA history syllabus, 2011", type: "Institutional decision" },
  { id: "MU_MISTRY", publisher: "University of Mumbai", title: "Withdrawal of ‘Such a Long Journey’ under s.14(7), Maharashtra Universities Act, 2010", type: "Institutional decision" },
  { id: "HUSAIN_CASES", publisher: "Delhi High Court", title: "Quashing of criminal proceedings against M.F. Husain", type: "Court judgment" },
  { id: "CBI_CASEBOOK", publisher: "Indian Express", title: "CBI Casebook: 60% UPA vs 95% NDA opposition share", type: "Investigative reporting" },
  { id: "ED_CASEBOOK", publisher: "Indian Express", title: "ED Casebook: post-2014 investigations of politicians", type: "Investigative reporting" },
];

export const sourceById = (id: string) => sources.find((s) => s.id === id);

export const auditCounts = () => {
  const c: Record<Verdict, number> = {
    NOT_ESTABLISHED: 0, MIXED: 0, SUPPORTED: 0, IMPROVEMENT: 0, NO_CHANGE: 0, NOT_AUDITED: 0,
  };
  matrix.forEach((r) => { c[r.verdict] += 1; });
  return c;
};


/* ── Freedom of Expression: the deep audit ────────────────────────────── */

export const expression = {
  name: "Freedom of Expression and Alternative Information",
  vdem: "v2x_freexp_altinf",
  values: [
    { year: 2010, score: 0.889 },
    { year: 2014, score: 0.812 },
    { year: 2023, score: 0.422 },
  ],
  changes: { pre: -0.077, post: -0.390, postPercentOf2014: -48.03 },
  inputs: [
    "Government media censorship", "Journalist harassment", "Media self-censorship",
    "Media bias", "Critical media", "Range of media perspectives",
    "Political discussion — men", "Political discussion — women",
    "Academic and cultural expression",
  ],
  summary: { NOT_ESTABLISHED: 7, SUPPORTED: 0, MIXED: 2 },
};

export type ExprFact = { when: string; fact: string };
export type ExprIndicator = {
  order: number; id: string; vdem: string; name: string; verdict: Verdict;
  measures: string; pre: string; post: string;
  preFacts?: ExprFact[]; postFacts?: ExprFact[]; facts?: ExprFact[];
  conclusion: string; caveat?: string; sources: string[];
};

export const expressionIndicators: ExprIndicator[] = [
  {
    order: 1, id: "government_media_censorship", vdem: "v2mecenefm",
    name: "Government censorship effort — media", verdict: "NOT_ESTABLISHED",
    measures: "Direct or indirect government attempts to censor print or broadcast media.",
    pre: "Multiple direct restrictions already existed, including Kashmir news blackouts and politically connected channel blackouts.",
    post: "Asianet and MediaOne were temporarily taken off air in 2020; MediaOne lost permission in 2022; a 2016 NDTV India shutdown order was suspended before implementation.",
    preFacts: [
      { when: "2008", fact: "Jammu & Kashmir authorities prohibited local television news and current-affairs broadcasting for nine days." },
      { when: "2010", fact: "Local television news and current-affairs restrictions were again imposed in Kashmir." },
      { when: "2014", fact: "Times Now and India News disappeared from cable systems in Uttar Pradesh following negative reporting about the state government; operators reported instructions from higher authorities. This is a reported allegation, not an established order." },
    ],
    postFacts: [
      { when: "2016", fact: "NDTV India received a one-day shutdown order over Pathankot reporting. The order was put on hold before any blackout." },
      { when: "2020", fact: "Asianet News and MediaOne received 48-hour bans over Delhi-riot coverage and briefly went off air before the restrictions were lifted." },
      { when: "2022", fact: "MediaOne was taken off air after denial of security clearance. The Supreme Court later rejected treating critical or anti-establishment views as sufficient basis to restrict press freedom." },
    ],
    conclusion: "Government interference occurred in both periods. The cases reviewed do not demonstrate that direct political interference with news broadcasting clearly became more prevalent after 2014.",
    caveat: "This audit has not yet quantified every form of indirect financial, advertising or licensing pressure.",
    sources: ["JK_MEDIA_2008", "UP_MEDIA_2014", "MEDIA_BAN_2020", "MEDIAONE_SC_2023"],
  },
  {
    order: 2, id: "journalist_harassment", vdem: "v2meharjrn",
    name: "Harassment of journalists", verdict: "NOT_ESTABLISHED",
    measures: "Whether journalists are threatened, arrested, imprisoned, beaten or killed by governmental or powerful non-governmental actors because of legitimate journalistic activity.",
    pre: "Journalists were already imprisoned, assaulted and prosecuted under security and sedition laws.",
    post: "Journalist imprisonment and use of security legislation remained serious, and year-end prison counts were higher in some recent years.",
    facts: [
      { when: "Pre-2014", fact: "CPJ recorded three imprisoned journalists in its December 2012 India census." },
      { when: "Post-2014", fact: "CPJ recorded seven imprisoned journalists in India in both its 2022 and 2023 year-end censuses." },
    ],
    conclusion: "The counts differ — three against seven — but they are year-end snapshots of a very small number, and we have not examined the charge and circumstances in each case. By the standard this page applies everywhere else, a count that has not been case-checked does not demonstrate deterioration. Deterioration is plausible, particularly in prolonged detention and security-law cases; it is not established by the evidence reviewed.",
    caveat: "This verdict cuts both ways. It does not mean journalists were not harassed, or that the difference between three and seven is meaningless. It means the comparison has not been done to the standard required to score it, and the indicator covers threats, assault and killing as well as imprisonment — none of which we counted.",
    sources: ["CPJ_PRISON"],
  },
  {
    order: 3, id: "media_self_censorship", vdem: "v2meslfcen",
    name: "Media self-censorship", verdict: "MIXED",
    measures: "Whether journalists avoid politically sensitive reporting because they anticipate government or other powerful retaliation.",
    pre: "Self-censorship and editorial interference were already documented before 2014.",
    post: "Journalists and watchdog organisations report chilling effects from criminal cases, raids, online harassment and regulatory pressure.",
    conclusion: "There is evidence in both periods. Because self-censorship is by definition what does not get published, the magnitude of a post-2014 downgrade cannot be objectively reconstructed from the public record.",
    sources: ["VDEM_CODEBOOK_V14"],
  },
  {
    order: 4, id: "media_bias", vdem: "v2mebias",
    name: "Media bias against opposition", verdict: "MIXED",
    measures: "Whether major media systematically disadvantage opposition parties or candidates.",
    pre: "During the 2014 election the two leaders with the highest television visibility, Narendra Modi and Arvind Kejriwal, were both in opposition, while the incumbent party's leader had a fraction of it.",
    post: "During the 2019 election, Election Commission analysis found state-owned DD News gave substantially more coverage to the BJP than to Congress, and found the treatment inconsistent with neutrality and a level playing field.",
    conclusion: "Coverage volume is a poor proxy for bias. A leader who draws crowds, campaigns hard and makes news gets covered more, and that ability should not be scored as media favouritism. Applied consistently, that reasoning weakens the 2014 comparison and the raw 2019 hour count alike — neither shows what editors intended. What survives is narrower and firmer: a regulator's finding that the state broadcaster, which is bound by a neutrality obligation private channels do not carry, failed that obligation. That supports a specific criticism of public-broadcaster conduct in 2019. It does not establish systematic bias across India's private media, which is what this indicator measures.",
    caveat: "No nationwide private-media comparison was found for either period, so the magnitude of any private-sector bias is unmeasured in both directions. The DD News finding is strong precisely because it is not an inference from volume — it is a determination by the body that regulates the election.",
    sources: ["CMS_2014", "ECI_DD_2019"],
  },
  {
    order: 5, id: "media_critical", vdem: "v2mecrit",
    name: "Major media critical of government", verdict: "NOT_ESTABLISHED",
    measures: "Whether important print and broadcast media routinely criticise the government.",
    pre: "The UPA faced extensive critical reporting on corruption, governance failures, protests and economic policy.",
    post: "Important Indian media continued publishing and broadcasting criticism of demonetisation, GST, unemployment, the COVID response, the farmers' protests, CAA, Manipur, Adani, electoral bonds and other controversies.",
    conclusion: "The existence of major media routinely criticising the government remains clearly observable in both periods. A large comparative downgrade is not established.",
    sources: ["VDEM_CODEBOOK_V14"],
  },
  {
    order: 6, id: "media_perspectives", vdem: "v2merange",
    name: "Range of media perspectives", verdict: "NOT_ESTABLISHED",
    measures: "Whether major media collectively represent the important political perspectives present in society.",
    pre: "India already had a highly plural media ecosystem with strong ideological and regional differences.",
    post: "The ecosystem remained numerically enormous and included pro-BJP, anti-BJP, liberal, left, regionalist, communist, caste-based and minority perspectives.",
    conclusion: "Ownership concentration does not automatically mean political perspectives disappear. A broad collapse in available viewpoints is not demonstrated.",
    caveat: "Media ownership concentration and political links among owners are legitimate concerns, and channel count does not measure reach or editorial independence.",
    sources: ["MIB_CHANNELS"],
  },
  {
    order: 7, id: "political_discussion_men", vdem: "v2cldiscm",
    name: "Freedom of political discussion — men", verdict: "NOT_ESTABLISHED",
    measures: "Whether ordinary men can openly discuss political issues in private and public settings without government interference.",
    pre: "Arrests over political speech were already occurring, including under Section 66A.",
    post: "Political-speech arrests and FIRs continued, while mass protests, opposition campaigns, social-media criticism and ordinary political discussion remained widespread.",
    preFacts: [
      { when: "2012", fact: "Cartoonist Aseem Trivedi was arrested and faced sedition allegations over anti-corruption political cartoons." },
      { when: "2012", fact: "Jadavpur University professor Ambikesh Mahapatra was arrested after forwarding a political cartoon mocking the state government." },
      { when: "2012–13", fact: "Freedom House documented multiple Section 66A cases involving political and social-media speech." },
    ],
    conclusion: "Bad cases occurred in both periods. The evidence reviewed does not establish a transition from generally free political discussion to systematic intervention.",
    sources: ["FH_INDIA"],
  },
  {
    order: 8, id: "political_discussion_women", vdem: "v2cldiscw",
    name: "Freedom of political discussion — women", verdict: "NOT_ESTABLISHED",
    measures: "Whether ordinary women can openly discuss political issues without government interference.",
    pre: "The baseline already contains a textbook case of state intervention against ordinary women's political expression.",
    post: "Women activists and social-media users have also faced criminal cases and detention, while women continued to participate prominently in anti-CAA protests, the farmers' protests, electoral politics and online debate.",
    preFacts: [
      { when: "2012", fact: "Shaheen Dhada and Rinu Shrinivasan were arrested after one criticised Mumbai's shutdown following Bal Thackeray's death on Facebook, and the other liked the post." },
    ],
    conclusion: "A systematic post-2014 deterioration has not been demonstrated relative to a baseline that already contained this kind of intervention.",
    sources: ["FH_INDIA"],
  },
  {
    order: 9, id: "academic_cultural_expression", vdem: "v2clacfree",
    name: "Academic and cultural expression", verdict: "NOT_ESTABLISHED",
    measures: "Whether academics and cultural actors can discuss political issues without censorship or intimidation from public authorities.",
    pre: "The baseline is not thin. Universities withdrew set texts by administrative fiat, a state government banned a scholarly book, and India's best-known painter died in exile after criminal cases were filed against him in several states.",
    post: "Documented police, disciplinary and administrative interventions involving university expression and protest.",
    preFacts: [
      { when: "2004", fact: "Maharashtra banned James Laine's book on Shivaji; the research institute that had assisted him was vandalised." },
      { when: "2006–11", fact: "M.F. Husain left India in 2006 after criminal cases under sections 153A, 295A and 292 were filed against him across several states over his paintings. He died in exile in 2011; the Delhi High Court had by then quashed the proceedings." },
      { when: "2010", fact: "The Vice-Chancellor of the University of Mumbai used emergency powers under section 14(7) of the Maharashtra Universities Act to withdraw Rohinton Mistry's novel from the English syllabus, after a complaint by a Shiv Sena politician." },
      { when: "2011", fact: "Delhi University's Academic Council removed A.K. Ramanujan's essay ‘Three Hundred Ramayanas’ from the BA history syllabus. A committee had voted to keep it; it was dropped anyway to avoid further controversy." },
      { when: "2012", fact: "Jadavpur professor Ambikesh Mahapatra was arrested after circulating political satire." },
      { when: "2012", fact: "Salman Rushdie did not attend the Jaipur Literature Festival following protests and reported threats." },
      { when: "2014", fact: "Penguin withdrew Wendy Doniger's ‘The Hindus’ following litigation under section 295A. This was private litigation, not a government ban." },
    ],
    postFacts: [
      { when: "Post-2014", fact: "Scholars at Risk documented repeated police, disciplinary and administrative interventions involving university expression and protest." },
      { when: "2023", fact: "Several universities attempted to prevent screenings of the BBC Modi documentary, with disciplinary and police intervention reported at some campuses." },
    ],
    conclusion: "Post-2014 interventions on campuses are real and documented. But the earlier period contains the same category of action, and in several cases a more severe form of it: two universities removed prescribed texts by administrative decision, a state government banned a scholarly work, and an artist was driven out of the country by criminal prosecution. On a like-for-like comparison the evidence reviewed does not establish that academic and cultural expression deteriorated relative to that baseline.",
    caveat: "Much of the pre-2014 pressure came through private litigation and mob action that authorities accommodated, while more of the post-2014 examples involve direct administrative and police action on campus. That is a difference in mechanism, not obviously in severity, and we have not weighted the two.",
    sources: ["SAR_INDIA", "DU_RAMANUJAN", "MU_MISTRY", "HUSAIN_CASES"],
  },
];

/** Two lanes, so the baseline is visible rather than assumed. */
export const censorshipTimeline = [
  { year: 2008, era: "pre",  event: "J&K local television news and current-affairs ban", status: "Implemented" },
  { year: 2010, era: "pre",  event: "Renewed Kashmir local-news restrictions", status: "Implemented" },
  { year: 2014, era: "pre",  event: "Times Now and India News cable blackout in Uttar Pradesh after negative coverage of the state government", status: "Implemented · government-linked allegation" },
  { year: 2016, era: "post", event: "NDTV India one-day shutdown order", status: "Ordered but not implemented" },
  { year: 2020, era: "post", event: "Asianet News and MediaOne Delhi-riot coverage ban", status: "Implemented, lifted early" },
  { year: 2022, era: "post", event: "MediaOne permission and security-clearance shutdown", status: "Implemented" },
  { year: 2023, era: "post", event: "Supreme Court quashes the MediaOne restriction and rejects critical or ‘anti-establishment’ views as sufficient justification", status: "Judicial reversal" },
] as const;

export const mediaBias = {
  y2014: [
    { leader: "Arvind Kejriwal", status: "Opposition", share: 28.19 },
    { leader: "Narendra Modi", status: "Opposition", share: 23.98 },
    { leader: "Rahul Gandhi", status: "Ruling Congress", share: 4.76 },
  ],
  y2019: [
    { party: "BJP", hours: 160 },
    { party: "Congress", hours: 80 },
  ],
};

export const satelliteChannels = [
  { period: "2010–11", channels: 603 },
  { period: "2013–14", channels: 859 },
  { period: "2019–20", channels: 918 },
  { period: "2022–23", channels: 905 },
];
