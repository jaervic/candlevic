import { NextResponse } from "next/server";
import { kvConfigured, setBackup } from "@/lib/kv";

export const runtime = "nodejs";

const KEY_RE = /^[a-f0-9]{64}$/;
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + 60 * 60 * 1000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 40;
}

function validPayload(payload: unknown): payload is {
  v: 1;
  salt: string;
  iv: string;
  ct: string;
} {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Record<string, unknown>;
  return (
    p.v === 1 &&
    typeof p.salt === "string" &&
    typeof p.iv === "string" &&
    typeof p.ct === "string" &&
    p.salt.length < 200 &&
    p.iv.length < 200 &&
    p.ct.length < 120_000
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  if (!kvConfigured()) {
    return NextResponse.json(
      { error: "KV_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  let body: { key?: unknown; payload?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  if (typeof body.key !== "string" || !KEY_RE.test(body.key)) {
    return NextResponse.json({ error: "BAD_KEY" }, { status: 400 });
  }

  if (!validPayload(body.payload)) {
    return NextResponse.json({ error: "BAD_PAYLOAD" }, { status: 400 });
  }

  try {
    const updatedAt = await setBackup(body.key, body.payload);
    return NextResponse.json({ ok: true, updatedAt });
  } catch {
    return NextResponse.json({ error: "STORAGE_ERROR" }, { status: 503 });
  }
}
