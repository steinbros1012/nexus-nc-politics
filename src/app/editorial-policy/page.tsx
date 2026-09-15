import type { Metadata } from "next";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `${PUBLICATION_NAME} editorial policy and guidelines for news aggregation and opinion submissions.`,
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>

      <div className="prose prose-lg max-w-none">
        <h2>News Aggregation Standards</h2>
        <p>
          {PUBLICATION_NAME} aggregates political news from established,
          reputable North Carolina news organizations. We select sources based
          on their editorial standards, accuracy track record, and commitment to
          fair reporting.
        </p>

        <h3>Source Selection Criteria</h3>
        <ul>
          <li>Established news organizations with editorial oversight</li>
          <li>History of accurate, fact-based reporting</li>
          <li>Coverage of North Carolina politics and policy</li>
          <li>Compliance with basic journalistic standards</li>
        </ul>

        <h3>Attribution</h3>
        <p>
          Every aggregated article on {PUBLICATION_NAME} is clearly attributed
          to its original publisher. We provide summaries for convenience but
          always link to the full, original article. We never present others'
          work as our own.
        </p>

        <h2>Opinion Section Guidelines</h2>

        <h3>Editorials and Op-Eds</h3>
        <ul>
          <li>Must be original, unpublished work</li>
          <li>Should be between 800-1,200 words</li>
          <li>Must focus on North Carolina politics or policy</li>
          <li>
            Authors must identify themselves and disclose relevant affiliations
          </li>
          <li>Claims should be supported by verifiable facts</li>
          <li>May be edited for length, clarity, and style</li>
        </ul>

        <h3>Letters to the Editor</h3>
        <ul>
          <li>Should be between 200-400 words</li>
          <li>Must include author name and city of residence</li>
          <li>Should respond to specific news coverage or policy issues</li>
          <li>May be edited for length and clarity</li>
        </ul>

        <h3>What We Do Not Publish</h3>
        <ul>
          <li>Content that promotes violence or hatred</li>
          <li>Defamatory or libelous statements</li>
          <li>Content that violates others' privacy</li>
          <li>Plagiarized content</li>
          <li>
            Content that is primarily promotional for a commercial entity
          </li>
        </ul>

        <h2>Corrections</h2>
        <p>
          If you believe an aggregated summary misrepresents the original
          article, or if you find an error in our opinion section, please
          contact us immediately. We take accuracy seriously and will issue
          corrections promptly.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about our editorial policy? Reach out via our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
