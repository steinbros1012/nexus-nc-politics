import { unstable_cache, revalidateTag } from "next/cache";
import prisma from "./prisma";

// Public pages read from the database through this cache so that visits
// (including bots) don't wake the Neon database. The cache is cleared after
// every import and every admin change, so content still updates right away.
export const CONTENT_TAG = "content";

// Safety net: even if nothing clears the cache, refresh at least once a day.
const MAX_AGE_SECONDS = 60 * 60 * 24;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

// Cached results are stored as JSON, which turns Date objects into strings.
// Turn them back into Dates so pages behave exactly as with live queries.
function reviveDates<T>(value: T): T {
  if (typeof value === "string") {
    return (ISO_DATE.test(value) ? new Date(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => reviveDates(v)) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = reviveDates(v);
    return out as T;
  }
  return value;
}

export function cached<A extends unknown[], R>(
  key: string,
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<R> {
  const cachedFn = unstable_cache(fn, [key], {
    tags: [CONTENT_TAG],
    revalidate: MAX_AGE_SECONDS,
  });
  return async (...args: A) => reviveDates(await cachedFn(...args));
}

// Call after anything that changes what public pages show.
export function refreshPublicPages() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
}

// Read-only, cached stand-ins for the Prisma models public pages use.
// Same call shape as prisma.<model>.<method>(args); the args are part of
// the cache key.
type ReadMethod = "findMany" | "findFirst" | "findUnique" | "count";
type CachedModels = "article" | "category" | "region" | "market" | "opinionSubmission";

function cachedModel<M extends CachedModels>(model: M) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = prisma[model] as any;
  const wrap = (method: ReadMethod) =>
    cached(`db.${model}.${method}`, (args?: unknown) => delegate[method](args));
  return {
    findMany: wrap("findMany"),
    findFirst: wrap("findFirst"),
    findUnique: wrap("findUnique"),
    count: wrap("count"),
  } as unknown as Pick<(typeof prisma)[M], ReadMethod>;
}

export const db = {
  article: cachedModel("article"),
  category: cachedModel("category"),
  region: cachedModel("region"),
  market: cachedModel("market"),
  opinionSubmission: cachedModel("opinionSubmission"),
};
