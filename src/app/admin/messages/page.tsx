import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Inquiry",
  feedback: "Feedback",
  correction: "Report a Correction",
  source: "Suggest a News Source",
  partnership: "Partnership Inquiry",
  opinion: "Opinion Submission Question",
};

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Contact Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <span className="text-sm text-gray-400">{messages.length} total</span>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg card-shadow p-12 text-center">
          <p className="text-gray-400">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg card-shadow p-5 border-l-4 ${
                msg.read ? "border-l-gray-100" : "border-l-[#b91c1c]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!msg.read && (
                      <span className="inline-block bg-[#b91c1c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                        New
                      </span>
                    )}
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {SUBJECT_LABELS[msg.subject] || msg.subject}
                    </span>
                  </div>
                  <p className="font-semibold text-[#0f172a]">
                    {msg.name}
                  </p>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-[#1d4ed8] hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
                <time className="text-xs text-gray-400 shrink-0">
                  {formatDate(msg.createdAt)}
                </time>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-50 pt-3">
                {msg.message}
              </p>
              <div className="mt-3">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-block text-xs font-medium text-[#1d4ed8] hover:underline"
                >
                  Reply via email &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
