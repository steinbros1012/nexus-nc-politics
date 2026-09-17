import prisma from "@/lib/prisma";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const [subscribers, totalCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Newsletter Subscribers</h1>
          <p className="text-gray-400 text-sm mt-0.5">{totalCount} active subscriber{totalCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-xl text-sm font-semibold">
          <Users className="w-4 h-4" />
          {totalCount} total
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Users className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Email</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Status</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${s.email}`}
                      className="text-sm font-medium text-[#0f172a] hover:text-[#1d4ed8] transition-colors"
                    >
                      {s.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {s.active ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-400 tabular-nums">
                      {s.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
