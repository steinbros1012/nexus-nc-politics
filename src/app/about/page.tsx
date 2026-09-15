import type { Metadata } from "next";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${PUBLICATION_NAME} and our mission to inform North Carolinians about state politics and policy.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About {PUBLICATION_NAME}</h1>

      <div className="prose prose-lg max-w-none">
        <p>
          <strong>{PUBLICATION_NAME}</strong> is a nonpartisan political news
          aggregation and opinion platform dedicated to keeping North
          Carolinians informed about the political forces shaping their state.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe that an informed citizenry is the foundation of a
          functioning democracy. {PUBLICATION_NAME} aggregates political news
          from trusted sources across North Carolina, providing a single
          destination for comprehensive coverage of state politics, elections,
          legislation, and policy.
        </p>

        <h2>What We Do</h2>
        <ul>
          <li>
            <strong>Aggregate:</strong> We pull political news from established
            North Carolina news sources, making it easy to stay informed
            without visiting dozens of websites.
          </li>
          <li>
            <strong>Organize:</strong> Articles are categorized by topic and
            region, so you can quickly find the news that matters most to you.
          </li>
          <li>
            <strong>Amplify Voices:</strong> Our opinion section provides a
            platform for North Carolinians to share their perspectives on the
            issues that affect their communities.
          </li>
        </ul>

        <h2>A Product of Nexus Strategies</h2>
        <p>
          {PUBLICATION_NAME} is produced by Nexus Strategies, a North
          Carolina-based organization committed to civic engagement and
          political awareness. We are not affiliated with any political party,
          candidate, or special interest group.
        </p>

        <h2>Source Attribution</h2>
        <p>
          All aggregated news articles remain the intellectual property of their
          original publishers. We provide summaries and link to original
          articles. We encourage readers to visit the original sources for
          complete coverage.
        </p>

        <h2>Contact</h2>
        <p>
          Have questions, feedback, or want to partner with us? Visit our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
