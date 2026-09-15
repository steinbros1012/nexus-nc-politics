export interface Classification {
  categorySlug: string | null;
  regionSlug: string | null;
  marketSlug: string | null;
  tags: string[];
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  elections: [
    "election",
    "campaign",
    "ballot",
    "candidate",
    "vote",
    "voting",
    "primary",
    "runoff",
    "polling",
    "poll",
    "race",
    "congressional",
    "senate race",
    "house race",
    "gubernatorial",
  ],
  legislature: [
    "general assembly",
    "senate",
    "house of representatives",
    "legislature",
    "legislator",
    "bill",
    "legislation",
    "committee",
    "session",
    "speaker",
    "majority leader",
    "minority leader",
    "state senate",
    "state house",
  ],
  government: [
    "governor",
    "agency",
    "department",
    "commission",
    "board",
    "appointed",
    "administration",
    "executive order",
    "cabinet",
    "state government",
  ],
  courts: [
    "court",
    "judge",
    "ruling",
    "lawsuit",
    "legal",
    "supreme court",
    "appeals",
    "decision",
    "verdict",
    "judicial",
    "attorney general",
  ],
  education: [
    "school",
    "education",
    "university",
    "college",
    "unc",
    "nc state",
    "duke",
    "teacher",
    "student",
    "classroom",
    "curriculum",
    "board of education",
  ],
  healthcare: [
    "health",
    "hospital",
    "medicaid",
    "medicare",
    "insurance",
    "healthcare",
    "mental health",
    "opioid",
    "drug",
    "medical",
  ],
  economy: [
    "economy",
    "jobs",
    "employment",
    "unemployment",
    "budget",
    "tax",
    "revenue",
    "business",
    "economic",
    "growth",
    "industry",
    "workforce",
  ],
  environment: [
    "environment",
    "climate",
    "energy",
    "pollution",
    "clean water",
    "conservation",
    "natural resources",
    "solar",
    "coal",
    "utilities",
  ],
  local: [
    "city council",
    "county commissioner",
    "mayor",
    "municipality",
    "local government",
    "zoning",
    "development",
  ],
};

const REGION_KEYWORDS: Record<string, string[]> = {
  triangle: [
    "raleigh",
    "durham",
    "chapel hill",
    "cary",
    "wake county",
    "durham county",
    "orange county",
    "research triangle",
  ],
  "charlotte-region": [
    "charlotte",
    "mecklenburg",
    "gastonia",
    "concord",
    "matthews",
    "huntersville",
    "mooresville",
  ],
  triad: [
    "greensboro",
    "winston-salem",
    "high point",
    "guilford county",
    "forsyth county",
    "alamance",
    "burlington",
  ],
  "western-nc": [
    "asheville",
    "buncombe",
    "boone",
    "watauga",
    "cherokee",
    "bryson city",
    "hendersonville",
    "brevard",
    "western north carolina",
  ],
  "coastal-nc": [
    "wilmington",
    "new hanover",
    "outer banks",
    "dare county",
    "morehead city",
    "beaufort",
    "jacksonville",
    "onslow",
  ],
  "eastern-nc": [
    "greenville",
    "rocky mount",
    "wilson",
    "pitt county",
    "nash county",
    "edgecombe",
    "goldsboro",
    "wayne county",
    "kinston",
    "eastern north carolina",
  ],
  piedmont: [
    "burlington",
    "alamance",
    "randolph county",
    "asheboro",
    "sanford",
    "lee county",
  ],
  sandhills: [
    "fayetteville",
    "cumberland county",
    "pinehurst",
    "southern pines",
    "moore county",
    "fort bragg",
    "fort liberty",
  ],
};

const MARKET_KEYWORDS: Record<string, string[]> = {
  raleigh: ["raleigh", "wake county"],
  durham: ["durham"],
  "chapel-hill": ["chapel hill", "orange county"],
  charlotte: ["charlotte", "mecklenburg"],
  greensboro: ["greensboro", "guilford county"],
  "winston-salem": ["winston-salem", "forsyth county"],
  asheville: ["asheville", "buncombe county"],
  wilmington: ["wilmington", "new hanover"],
  fayetteville: ["fayetteville", "cumberland county"],
  greenville: ["greenville", "pitt county"],
  boone: ["boone", "watauga"],
};

function matchKeywords(
  text: string,
  keywords: Record<string, string[]>
): string | null {
  const lower = text.toLowerCase();
  let bestMatch: string | null = null;
  let bestCount = 0;

  for (const [key, words] of Object.entries(keywords)) {
    const count = words.filter((w) => lower.includes(w)).length;
    if (count > bestCount) {
      bestCount = count;
      bestMatch = key;
    }
  }

  return bestCount > 0 ? bestMatch : null;
}

export function classifyArticle(
  title: string,
  summary?: string | null
): Classification {
  const text = `${title} ${summary || ""}`.toLowerCase();

  const categorySlug = matchKeywords(text, CATEGORY_KEYWORDS);
  const regionSlug = matchKeywords(text, REGION_KEYWORDS);
  const marketSlug = matchKeywords(text, MARKET_KEYWORDS);

  const tags: string[] = [];
  if (text.includes("republican") || text.includes(" gop "))
    tags.push("republican");
  if (text.includes("democrat")) tags.push("democrat");
  if (text.includes("bipartisan")) tags.push("bipartisan");
  if (text.includes("budget")) tags.push("budget");
  if (text.includes("election")) tags.push("elections");

  return { categorySlug, regionSlug, marketSlug, tags };
}
