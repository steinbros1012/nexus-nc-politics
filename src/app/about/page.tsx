import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Scale, MapPin, Users } from "lucide-react";

const PUBLICATION_NAME =
  process.env.NEXT_PUBLIC_PUBLICATION_NAME || "NC Politics Now";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${PUBLICATION_NAME} and our mission to inform North Carolinians about state politics and policy.`,
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-6 py-5 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function PillarCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-[#b91c1c]/8 flex items-center justify-center mt-0.5">
        <Icon className="w-5 h-5 text-[#b91c1c]" />
      </div>
      <div>
        <h3 className="font-bold text-[#0f172a] mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            North Carolina&apos;s political news,{" "}
            <span className="text-[#b91c1c]">in one place.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {PUBLICATION_NAME} aggregates political news from trusted NC sources
            so you can stay fully informed without visiting dozens of websites.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="15+" label="News Sources" />
          <StatCard value="Daily" label="Updates" />
          <StatCard value="100%" label="Nonpartisan" />
          <StatCard value="Free" label="Always" />
        </div>

        {/* Mission */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 bg-[#b91c1c] rounded-full" />
            <h2 className="text-xl font-bold text-[#0f172a] uppercase tracking-wide">
              Our Mission
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-base">
            We believe an informed citizenry is the foundation of a functioning
            democracy. {PUBLICATION_NAME} exists to make it easy for North
            Carolinians to follow the political forces shaping their state —
            from the General Assembly and the governor&apos;s office to county
            courthouses and local ballots.
          </p>
          <p className="text-gray-600 leading-relaxed text-base mt-4">
            We pull together political coverage from established NC newsrooms,
            organize it by topic and region, and publish it in one clean feed.
            No algorithm, no engagement bait — just the news that matters.
          </p>
        </div>

        {/* Pillars */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-[#b91c1c] rounded-full" />
            <h2 className="text-xl font-bold text-[#0f172a] uppercase tracking-wide">
              What We Do
            </h2>
          </div>
          <div className="space-y-6">
            <PillarCard
              icon={Newspaper}
              title="Aggregate"
              body="We pull political news from established North Carolina newsrooms daily, making it easy to stay informed without visiting dozens of sites."
            />
            <PillarCard
              icon={MapPin}
              title="Organize"
              body="Articles are categorized by topic — politics, elections, legislature, courts, and more — and by region across the state."
            />
            <PillarCard
              icon={Users}
              title="Amplify Voices"
              body="Our opinion section provides a platform for North Carolinians to share editorials and letters to the editor on the issues that affect their communities."
            />
            <PillarCard
              icon={Scale}
              title="Stay Independent"
              body="We are not affiliated with any political party, candidate, campaign, or special interest group. Our coverage is driven by what matters to NC residents."
            />
          </div>
        </div>

        {/* Attribution */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-[#b91c1c] rounded-full" />
            <h2 className="text-xl font-bold text-[#0f172a] uppercase tracking-wide">
              Source Attribution
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            All aggregated articles remain the intellectual property of their
            original publishers. {PUBLICATION_NAME} displays summaries and
            always links directly to the full article on the source website. We
            never present others&apos; reporting as our own. If you believe we
            have misrepresented a story, please{" "}
            <Link href="/contact" className="text-[#1d4ed8] hover:underline">
              contact us
            </Link>{" "}
            immediately.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="border-t border-gray-100 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#0f172a] mb-1">Get in touch</h3>
            <p className="text-sm text-gray-500">
              Questions, feedback, or partnership inquiries?
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors no-underline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
