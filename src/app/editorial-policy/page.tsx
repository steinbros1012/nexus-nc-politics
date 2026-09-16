import type { Metadata } from "next";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `${PUBLICATION_NAME} editorial policy and guidelines for news aggregation and opinion submissions.`,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#0f172a] mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-[#0f172a] mb-2">{title}</h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-[#4b5563] text-sm leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b91c1c] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
          Editorial Policy
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          {PUBLICATION_NAME} is committed to accurate, fair, and transparent coverage of North Carolina politics. The following guidelines govern how we aggregate news, publish opinions, and handle corrections.
        </p>
      </div>

      <Section title="News Aggregation Standards">
        <p className="text-[#4b5563] text-sm leading-relaxed mb-6">
          {PUBLICATION_NAME} aggregates political news from established, reputable North Carolina news organizations. We select sources based on their editorial standards, accuracy track record, and commitment to fair reporting.
        </p>

        <Subsection title="Source Selection Criteria">
          <BulletList items={[
            "Established news organizations with editorial oversight",
            "History of accurate, fact-based reporting",
            "Coverage of North Carolina politics and policy",
            "Compliance with basic journalistic standards",
          ]} />
        </Subsection>

        <Subsection title="Attribution">
          <p className="text-[#4b5563] text-sm leading-relaxed">
            Every aggregated article on {PUBLICATION_NAME} is clearly attributed to its original publisher. We provide summaries for convenience but always link to the full, original article. We never present others' work as our own.
          </p>
        </Subsection>
      </Section>

      <Section title="Opinion Section Guidelines">
        <p className="text-[#4b5563] text-sm leading-relaxed mb-6">
          {PUBLICATION_NAME} welcomes opinion submissions from North Carolinians across the political spectrum. The following standards apply to all submitted content.
        </p>

        <Subsection title="Editorials and Op-Eds">
          <BulletList items={[
            "Must be original, unpublished work",
            "Should be between 800–1,200 words",
            "Must focus on North Carolina politics or policy",
            "Authors must identify themselves and disclose relevant affiliations",
            "Claims should be supported by verifiable facts",
            "May be edited for length, clarity, and style",
          ]} />
        </Subsection>

        <Subsection title="Letters to the Editor">
          <BulletList items={[
            "Should be between 200–400 words",
            "Must include author name and city of residence",
            "Should respond to specific news coverage or policy issues",
            "May be edited for length and clarity",
          ]} />
        </Subsection>

        <Subsection title="What We Do Not Publish">
          <BulletList items={[
            "Content that promotes violence or hatred",
            "Defamatory or libelous statements",
            "Content that violates others' privacy",
            "Plagiarized content",
            "Content that is primarily promotional for a commercial entity",
          ]} />
        </Subsection>
      </Section>

      <Section title="Corrections">
        <p className="text-[#4b5563] text-sm leading-relaxed">
          If you believe an aggregated summary misrepresents the original article, or if you find an error in our opinion section, please contact us immediately. We take accuracy seriously and will issue corrections promptly.
        </p>
      </Section>

      <Section title="Contact">
        <p className="text-[#4b5563] text-sm leading-relaxed">
          Questions about our editorial policy? Reach out via our{" "}
          <a href="/contact" className="text-[#1d4ed8] hover:underline">
            contact page
          </a>.
        </p>
      </Section>
    </div>
  );
}
