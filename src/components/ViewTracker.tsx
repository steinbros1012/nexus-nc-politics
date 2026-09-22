"use client";

import { useEffect } from "react";

export default function ViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `viewed:${articleId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/track/view/${articleId}`, { method: "POST" }).catch(() => {});
  }, [articleId]);

  return null;
}
