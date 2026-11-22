"use client";

import { useEffect } from "react";

export default function OpinionViewTracker({ opinionId }: { opinionId: string }) {
  useEffect(() => {
    const key = `viewed-opinion:${opinionId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/track/opinion-view/${opinionId}`, { method: "POST" }).catch(() => {});
  }, [opinionId]);

  return null;
}
