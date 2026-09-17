import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — works well for Vercel's fluid compute (instance reuse)
const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Returns a 429 response if the IP exceeds the limit, otherwise null.
 * @param req - The incoming request
 * @param key - A unique key for this route (e.g. "contact")
 * @param max - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 */
export function rateLimit(
  req: NextRequest,
  key: string,
  max: number,
  windowMs: number
): NextResponse | null {
  const ip = getIp(req);
  const storeKey = `${key}:${ip}`;
  const now = Date.now();

  const entry = store.get(storeKey);

  if (!entry || entry.resetAt < now) {
    store.set(storeKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  entry.count++;
  return null;
}
