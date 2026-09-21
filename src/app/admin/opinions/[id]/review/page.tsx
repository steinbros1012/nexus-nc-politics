"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OpinionData {
  id: string;
  type: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string;
  organization: string | null;
  titleRole: string | null;
  headline: string;
  body: string;
  authorBio: string | null;
  supportingLinks: string[];
  confirmOriginal: boolean;
  confirmAccuracy: boolean;
  confirmEditing: boolean;
  adminNotes: string | null;
  slug: string | null;
  createdAt: string;
}

export default function ReviewOpinionPage() {
  const params = useParams();
  const router = useRouter();
  const [opinion, setOpinion] = useState<OpinionData | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/opinions/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOpinion(data.opinion);
        setAdminNotes(data.opinion?.adminNotes || "");
      })
      .catch(() => setMessage("Failed to load."));
  }, [params.id]);

  async function deleteOpinion() {
    if (!confirm("Permanently delete this submission? This cannot be undone.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/opinions/${params.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/opinions");
      } else {
        setMessage("Failed to delete.");
        setSaving(false);
      }
    } catch {
      setMessage("Network error.");
      setSaving(false);
    }
  }

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/opinions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setOpinion(data.opinion);
        setMessage(`Status updated to ${newStatus}.`);
        if (newStatus === "PUBLISHED") {
          router.push("/admin/opinions?status=PUBLISHED");
        }
      } else {
        setMessage("Failed to update.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (!opinion) {
    return (
      <div className="p-8 text-center text-gray-500">
        {message || "Loading..."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Opinion</h1>
        <Link
          href="/admin/opinions"
          className="text-sm text-gray-500 hover:text-gray-700 no-underline"
        >
          Back to Opinions
        </Link>
      </div>

      {/* Status badge */}
      <div className="mb-6">
        <span className="text-sm font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
          {opinion.status.replace("_", " ")}
        </span>
        <span className="text-sm ml-3 text-gray-500">
          {opinion.type === "EDITORIAL" ? "Editorial / Op-Ed" : "Letter to the Editor"}
        </span>
      </div>

      {/* Author info */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="font-bold text-lg mb-3">Author Information</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Name:</span>{" "}
            {opinion.firstName} {opinion.lastName}
          </div>
          <div>
            <span className="text-gray-500">Email:</span> {opinion.email}
          </div>
          {opinion.phone && (
            <div>
              <span className="text-gray-500">Phone:</span> {opinion.phone}
            </div>
          )}
          {opinion.city && (
            <div>
              <span className="text-gray-500">Location:</span> {opinion.city},{" "}
              {opinion.state}
            </div>
          )}
          {opinion.organization && (
            <div>
              <span className="text-gray-500">Organization:</span>{" "}
              {opinion.organization}
            </div>
          )}
          {opinion.titleRole && (
            <div>
              <span className="text-gray-500">Title:</span>{" "}
              {opinion.titleRole}
            </div>
          )}
        </div>
        <div className="mt-3 text-sm">
          <span className="text-gray-500">Confirmations:</span>{" "}
          {opinion.confirmOriginal ? "Original" : ""}{" "}
          {opinion.confirmAccuracy ? "| Accurate" : ""}{" "}
          {opinion.confirmEditing ? "| Editing OK" : ""}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="text-xl font-bold mb-4">{opinion.headline}</h2>
        <div className="prose max-w-none text-gray-700">
          {opinion.body.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {opinion.authorBio && (
          <div className="mt-4 pt-4 border-t border-gray-100 italic text-sm text-gray-500">
            {opinion.authorBio}
          </div>
        )}

        {opinion.supportingLinks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Supporting Links
            </h3>
            <ul className="text-sm space-y-1">
              {opinion.supportingLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 break-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Admin notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <h2 className="font-bold text-lg mb-3">Admin Notes</h2>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Internal notes about this submission..."
        />
      </div>

      {message && (
        <p
          className={`text-sm mb-4 ${message.includes("updated") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {opinion.status !== "PUBLISHED" && (
          <button
            onClick={() => updateStatus("PUBLISHED")}
            disabled={saving}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Publish
          </button>
        )}
        {opinion.status !== "APPROVED" && opinion.status !== "PUBLISHED" && (
          <button
            onClick={() => updateStatus("APPROVED")}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Approve
          </button>
        )}
        {opinion.status !== "UNDER_REVIEW" && opinion.status !== "PUBLISHED" && (
          <button
            onClick={() => updateStatus("UNDER_REVIEW")}
            disabled={saving}
            className="bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50"
          >
            Mark Under Review
          </button>
        )}
        {opinion.status !== "CHANGES_REQUESTED" &&
          opinion.status !== "PUBLISHED" && (
            <button
              onClick={() => updateStatus("CHANGES_REQUESTED")}
              disabled={saving}
              className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
            >
              Request Changes
            </button>
          )}
        {opinion.status !== "REJECTED" && opinion.status !== "PUBLISHED" && (
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={saving}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        )}
        <button
          onClick={deleteOpinion}
          disabled={saving}
          className="ml-auto bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          Delete Permanently
        </button>
      </div>
    </div>
  );
}
