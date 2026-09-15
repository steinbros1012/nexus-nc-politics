import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin User ---
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 10);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@nexus.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@nexus.com",
      name: process.env.ADMIN_NAME || "Admin",
      password: hash,
      role: "SUPER_ADMIN",
    },
  });

  // --- Categories ---
  const categories = [
    { name: "Politics", slug: "politics", description: "NC political news and analysis", color: "#1e40af" },
    { name: "Elections", slug: "elections", description: "Election coverage, campaigns, and results", color: "#dc2626" },
    { name: "Legislature", slug: "legislature", description: "NC General Assembly news", color: "#7c3aed" },
    { name: "Government", slug: "government", description: "State and local government news", color: "#4f46e5" },
    { name: "Courts", slug: "courts", description: "Judicial and legal news", color: "#b45309" },
    { name: "Education", slug: "education", description: "Education policy and school news", color: "#059669" },
    { name: "Healthcare", slug: "healthcare", description: "Health policy and healthcare news", color: "#0d9488" },
    { name: "Economy", slug: "economy", description: "Economic news, jobs, and budget", color: "#ea580c" },
    { name: "Environment", slug: "environment", description: "Environmental and energy policy", color: "#16a34a" },
    { name: "Local", slug: "local", description: "City and county government news", color: "#0284c7" },
    { name: "Opinion", slug: "opinion", description: "Editorials, op-eds, and letters", color: "#374151" },
    { name: "Policy", slug: "policy", description: "Public policy analysis and debate", color: "#7c3aed" },
    { name: "Transportation", slug: "transportation", description: "Transportation and infrastructure", color: "#6366f1" },
    { name: "Housing", slug: "housing", description: "Housing policy and development", color: "#0891b2" },
    { name: "Criminal Justice", slug: "criminal-justice", description: "Criminal justice reform and law enforcement", color: "#9333ea" },
    { name: "Agriculture", slug: "agriculture", description: "Agricultural policy and rural affairs", color: "#65a30d" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // --- Regions ---
  const regions = [
    { name: "Western NC", slug: "western-nc", description: "Appalachian and mountain region", sortOrder: 1 },
    { name: "Piedmont", slug: "piedmont", description: "Central North Carolina", sortOrder: 2 },
    { name: "Triangle", slug: "triangle", description: "Raleigh-Durham-Chapel Hill metro area", sortOrder: 3 },
    { name: "Triad", slug: "triad", description: "Greensboro-Winston-Salem-High Point metro area", sortOrder: 4 },
    { name: "Charlotte Region", slug: "charlotte-region", description: "Greater Charlotte metro area", sortOrder: 5 },
    { name: "Sandhills", slug: "sandhills", description: "Fayetteville and surrounding area", sortOrder: 6 },
    { name: "Eastern NC", slug: "eastern-nc", description: "Eastern North Carolina", sortOrder: 7 },
    { name: "Coastal NC", slug: "coastal-nc", description: "North Carolina coast and Outer Banks", sortOrder: 8 },
  ];

  const regionMap: Record<string, string> = {};
  for (const region of regions) {
    const r = await prisma.region.upsert({
      where: { slug: region.slug },
      update: {},
      create: region,
    });
    regionMap[region.slug] = r.id;
  }

  // --- Markets ---
  const markets = [
    { name: "Raleigh", slug: "raleigh", regionSlug: "triangle" },
    { name: "Durham", slug: "durham", regionSlug: "triangle" },
    { name: "Chapel Hill", slug: "chapel-hill", regionSlug: "triangle" },
    { name: "Cary", slug: "cary", regionSlug: "triangle" },
    { name: "Charlotte", slug: "charlotte", regionSlug: "charlotte-region" },
    { name: "Greensboro", slug: "greensboro", regionSlug: "triad" },
    { name: "Winston-Salem", slug: "winston-salem", regionSlug: "triad" },
    { name: "High Point", slug: "high-point", regionSlug: "triad" },
    { name: "Asheville", slug: "asheville", regionSlug: "western-nc" },
    { name: "Boone", slug: "boone", regionSlug: "western-nc" },
    { name: "Wilmington", slug: "wilmington", regionSlug: "coastal-nc" },
    { name: "Outer Banks", slug: "outer-banks", regionSlug: "coastal-nc" },
    { name: "Fayetteville", slug: "fayetteville", regionSlug: "sandhills" },
    { name: "Greenville", slug: "greenville", regionSlug: "eastern-nc" },
    { name: "Rocky Mount", slug: "rocky-mount", regionSlug: "eastern-nc" },
    { name: "New Bern", slug: "new-bern", regionSlug: "eastern-nc" },
    { name: "Jacksonville", slug: "jacksonville", regionSlug: "coastal-nc" },
    { name: "Elizabeth City", slug: "elizabeth-city", regionSlug: "eastern-nc" },
    { name: "Hickory", slug: "hickory", regionSlug: "piedmont" },
  ];

  for (const market of markets) {
    await prisma.market.upsert({
      where: { slug: market.slug },
      update: {},
      create: {
        name: market.name,
        slug: market.slug,
        regionId: regionMap[market.regionSlug] || null,
      },
    });
  }

  // --- News Sources ---
  const sources = [
    {
      name: "WRAL News",
      slug: "wral-news",
      website: "https://www.wral.com",
      rssUrl: "https://www.wral.com/rss/category/politics-news/",
      description: "WRAL is a Raleigh-based news station covering North Carolina politics and government.",
      active: true,
    },
    {
      name: "NC Newsline",
      slug: "nc-newsline",
      website: "https://ncnewsline.com",
      rssUrl: "https://ncnewsline.com/feed/",
      description: "Nonprofit, nonpartisan news outlet covering NC politics, policy, and government.",
      active: true,
    },
    {
      name: "Carolina Journal",
      slug: "carolina-journal",
      website: "https://www.carolinajournal.com",
      rssUrl: "https://www.carolinajournal.com/feed/",
      description: "News and commentary on North Carolina government and policy from the John Locke Foundation.",
      active: true,
    },
    {
      name: "WUNC",
      slug: "wunc",
      website: "https://www.wunc.org",
      rssUrl: "https://www.wunc.org/rss.xml",
      description: "NPR member station covering North Carolina news, politics, and culture.",
      active: true,
    },
    {
      name: "NC Health News",
      slug: "nc-health-news",
      website: "https://www.northcarolinahealthnews.org",
      rssUrl: "https://www.northcarolinahealthnews.org/feed/",
      description: "Nonprofit news outlet covering health policy and healthcare in North Carolina.",
      active: true,
    },
    {
      name: "The News & Observer",
      slug: "news-observer",
      website: "https://www.newsobserver.com",
      rssUrl: null,
      description: "Raleigh's daily newspaper. Paywalled, no public RSS feed available.",
      active: false,
    },
    {
      name: "The Charlotte Observer",
      slug: "charlotte-observer",
      website: "https://www.charlotteobserver.com",
      rssUrl: null,
      description: "Charlotte's daily newspaper. No public RSS feed available.",
      active: false,
    },
    {
      name: "News & Record",
      slug: "news-record",
      website: "https://greensboro.com",
      rssUrl: "https://greensboro.com/search/?f=rss&t=article&c=news/government-politics&l=50&s=start_time&sd=desc",
      description: "Greensboro daily newspaper covering Triad news and NC politics.",
      active: true,
    },
  ];

  const sourceMap: Record<string, string> = {};
  for (const source of sources) {
    const s = await prisma.newsSource.upsert({
      where: { slug: source.slug },
      update: {},
      create: {
        name: source.name,
        slug: source.slug,
        website: source.website,
        rssUrl: source.rssUrl,
        description: source.description,
        active: source.active,
        geographicCoverage: [],
        categories: [],
      },
    });
    sourceMap[source.slug] = s.id;
  }

  // --- Category ID map ---
  const allCats = await prisma.category.findMany();
  const catMap: Record<string, string> = {};
  for (const c of allCats) catMap[c.slug] = c.id;

  // --- Region ID map ---
  const allRegions = await prisma.region.findMany();
  const regMap: Record<string, string> = {};
  for (const r of allRegions) regMap[r.slug] = r.id;

  // --- Market ID map ---
  const allMarkets = await prisma.market.findMany();
  const mktMap: Record<string, string> = {};
  for (const m of allMarkets) mktMap[m.slug] = m.id;

  // --- Demo Articles ---
  const now = Date.now();
  const DAY = 86400000;
  const defaultSourceId = sourceMap["wral-news"];

  const demoArticles = [
    {
      title: "General Assembly Convenes for Fall Short Session Amid Budget Negotiations",
      slug: "general-assembly-fall-short-session-demo",
      summary: "The North Carolina General Assembly opened its fall short session today with bipartisan calls for compromise on the state budget. Key issues include education funding, Medicaid expansion implementation, and infrastructure spending.",
      categorySlug: "legislature",
      publishedAt: new Date(now - DAY * 1),
      isFeatured: true,
      isBreaking: true,
    },
    {
      title: "Governor Signs Landmark Education Funding Bill",
      slug: "governor-signs-education-funding-bill-demo",
      summary: "Governor signed a sweeping education funding bill that allocates $2.3 billion in new spending for K-12 schools over the next three years, including teacher pay raises and school construction funds.",
      categorySlug: "government",
      publishedAt: new Date(now - DAY * 2),
    },
    {
      title: "NC Supreme Court Takes Up Redistricting Challenge",
      slug: "nc-supreme-court-redistricting-challenge-demo",
      summary: "The North Carolina Supreme Court agreed to hear arguments in a major redistricting case that could reshape the state's congressional and legislative maps before the next election cycle.",
      categorySlug: "courts",
      publishedAt: new Date(now - DAY * 3),
    },
    {
      title: "Senate Democrats Push Back on Proposed Tax Cuts",
      slug: "senate-democrats-push-back-tax-cuts-demo",
      summary: "Senate Democrats released a counter-proposal to the Republican-backed tax cut plan, arguing that the proposed reductions would disproportionately benefit high-income earners and reduce funding for essential services.",
      categorySlug: "elections",
      publishedAt: new Date(now - DAY * 3),
    },
    {
      title: "Triangle Region Leads State in Voter Registration Growth",
      slug: "triangle-voter-registration-growth-demo",
      summary: "New data shows the Triangle region has added more registered voters than any other part of the state this year, with Wake and Durham counties seeing the largest gains among young voters.",
      categorySlug: "elections",
      regionSlug: "triangle",
      publishedAt: new Date(now - DAY * 4),
    },
    {
      title: "Charlotte City Council Approves $1.2 Billion Transit Plan",
      slug: "charlotte-transit-plan-demo",
      summary: "Charlotte City Council voted 8-3 to approve a $1.2 billion transit expansion plan that includes new light rail extensions and enhanced bus service throughout Mecklenburg County.",
      categorySlug: "local",
      marketSlug: "charlotte",
      publishedAt: new Date(now - DAY * 5),
    },
    {
      title: "UNC System Faces Faculty Scrutiny Over DEI Policy Changes",
      slug: "unc-system-dei-policy-changes-demo",
      summary: "Faculty across the UNC System are pushing back against new policies that restrict diversity, equity, and inclusion programming, calling the changes politically motivated and harmful to campus culture.",
      categorySlug: "education",
      publishedAt: new Date(now - DAY * 5),
    },
    {
      title: "Western NC Communities Seek State Aid After Flooding",
      slug: "western-nc-flooding-aid-demo",
      summary: "Several Western North Carolina communities are seeking emergency state funding after severe flooding damaged roads, bridges, and homes in the mountain region.",
      categorySlug: "government",
      regionSlug: "western-nc",
      publishedAt: new Date(now - DAY * 6),
    },
    {
      title: "Fayetteville Mayor Announces Run for Congress",
      slug: "fayetteville-mayor-congress-run-demo",
      summary: "Fayetteville's mayor announced a bid for the newly redrawn 8th Congressional District, promising to bring a focus on military families and veterans' issues to Washington.",
      categorySlug: "elections",
      marketSlug: "fayetteville",
      publishedAt: new Date(now - DAY * 7),
    },
    {
      title: "State Health Plan Faces Criticism Over Rural Coverage Gaps",
      slug: "state-health-plan-rural-coverage-demo",
      summary: "Rural health advocates are criticizing the State Health Plan for failing to adequately cover residents in underserved areas, pointing to hospital closures and provider shortages as growing concerns.",
      categorySlug: "healthcare",
      publishedAt: new Date(now - DAY * 8),
    },
    {
      title: "NC Wind Energy Projects Face New Regulatory Hurdles",
      slug: "nc-wind-energy-regulatory-hurdles-demo",
      summary: "Proposed offshore wind energy projects along the North Carolina coast are facing new state regulatory requirements that developers say could delay construction by years.",
      categorySlug: "environment",
      publishedAt: new Date(now - DAY * 9),
    },
    {
      title: "Raleigh Council Debates Affordable Housing Ordinance",
      slug: "raleigh-affordable-housing-ordinance-demo",
      summary: "Raleigh City Council is considering a new affordable housing ordinance that would require developers to set aside a percentage of units for low-income residents in new residential projects.",
      categorySlug: "local",
      marketSlug: "raleigh",
      publishedAt: new Date(now - DAY * 10),
    },
    {
      title: "NC Attorney General Launches Investigation Into Price Gouging",
      slug: "nc-ag-price-gouging-investigation-demo",
      summary: "The North Carolina Attorney General's office has opened an investigation into reports of price gouging by several retail chains in the aftermath of recent severe weather events.",
      categorySlug: "courts",
      publishedAt: new Date(now - DAY * 11),
    },
    {
      title: "State Budget Writers Eye 4% Teacher Pay Raise",
      slug: "state-budget-teacher-pay-raise-demo",
      summary: "Budget negotiators in the General Assembly are converging on a 4% average teacher pay raise as part of the state budget, though some lawmakers argue the increase does not go far enough to address the teacher shortage.",
      categorySlug: "education",
      publishedAt: new Date(now - DAY * 12),
    },
    {
      title: "Asheville Tourism Revenue Sets Record Despite Challenges",
      slug: "asheville-tourism-revenue-record-demo",
      summary: "Asheville's tourism industry generated record revenue in the latest fiscal year despite ongoing challenges from infrastructure strain and debates over short-term rental regulations.",
      categorySlug: "economy",
      marketSlug: "asheville",
      publishedAt: new Date(now - DAY * 13),
    },
  ];

  for (let i = 0; i < demoArticles.length; i++) {
    const art = demoArticles[i];
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        title: art.title,
        slug: art.slug,
        summary: art.summary,
        originalUrl: `https://example-demo.com/article-${i + 1}`,
        publishedAt: art.publishedAt,
        sourceId: defaultSourceId,
        categoryId: art.categorySlug ? catMap[art.categorySlug] || null : null,
        regionId: art.regionSlug ? regMap[art.regionSlug] || null : null,
        marketId: art.marketSlug ? mktMap[art.marketSlug] || null : null,
        tags: ["demo"],
        isFeatured: art.isFeatured || false,
        isBreaking: art.isBreaking || false,
      },
    });
  }

  // --- Demo Opinions ---
  await prisma.opinionSubmission.upsert({
    where: { slug: "nc-infrastructure-gap-demo" },
    update: {},
    create: {
      type: "EDITORIAL",
      status: "PUBLISHED",
      firstName: "Demo",
      lastName: "Author",
      email: "demo@example.com",
      city: "Raleigh",
      state: "NC",
      organization: "NC Policy Watch (Demo)",
      headline: "North Carolina's Infrastructure Gap Must Be Addressed Now",
      body: "North Carolina faces a critical infrastructure gap that threatens our economic competitiveness and quality of life. From crumbling bridges in rural counties to overwhelmed stormwater systems in our growing cities, the evidence is clear: decades of deferred maintenance and underinvestment are catching up with us.\n\nThe latest report from the American Society of Civil Engineers gives North Carolina a C- grade for infrastructure, with particular concerns about our roads, bridges, and water systems. This is not just an abstract policy problem -- it affects real people every day.\n\nConsider the small towns in Eastern North Carolina where aging water treatment plants struggle to meet federal standards. Or the commuters in the Triangle who lose hours each week to congestion on highways designed for a fraction of current traffic. Or the farmers in the Piedmont whose products are delayed by bridges with weight restrictions.\n\nThe General Assembly must act decisively in the coming session to address this gap. A comprehensive infrastructure plan should include increased funding for road and bridge maintenance, investment in water and sewer systems, and forward-thinking planning for the transportation needs of our growing population.\n\nThis is not a partisan issue. Infrastructure investment benefits every North Carolinian, regardless of political affiliation. It creates jobs, supports economic growth, and improves public safety. The cost of inaction far exceeds the cost of investment.",
      authorBio: "Demo Author is a policy analyst based in Raleigh, NC. This is a demo opinion piece.",
      slug: "nc-infrastructure-gap-demo",
      publishedAt: new Date(now - DAY * 2),
      confirmOriginal: true,
      confirmAccuracy: true,
      confirmEditing: true,
      tags: ["infrastructure", "budget", "demo"],
    },
  });

  await prisma.opinionSubmission.upsert({
    where: { slug: "teacher-shortage-letter-demo" },
    update: {},
    create: {
      type: "LETTER",
      status: "PUBLISHED",
      firstName: "Demo",
      lastName: "Reader",
      email: "reader@example.com",
      city: "Durham",
      state: "NC",
      headline: "Letter: Thank You for Covering the Teacher Shortage",
      body: "As a parent of two children in Durham Public Schools, I want to thank NC Politics for its ongoing coverage of the teacher shortage crisis in North Carolina.\n\nMy children's school has had three substitute teachers this semester alone because they cannot fill permanent positions. The impact on learning is real and measurable.\n\nI urge our state legislators to prioritize teacher pay and support in the upcoming budget. Our children's future depends on it.",
      slug: "teacher-shortage-letter-demo",
      publishedAt: new Date(now - DAY * 4),
      confirmOriginal: true,
      confirmAccuracy: true,
      confirmEditing: true,
      tags: ["education", "demo"],
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
