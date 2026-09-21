"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteArticleButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Permanently delete this article? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Delete permanently"
      className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
