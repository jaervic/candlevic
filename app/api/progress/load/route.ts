import { NextResponse } from "next/server";
import { getBackup, kvConfigured } from "@/lib/kv";

export const runtime = "nodejs";

const KEY_RE = /^[a-f0-9]{64}$/;

export async function POST(request: Request) {
  if (!kvConfigured()) {
    return NextResponse.json({ error: "KV_NOT_CONFIGURED" }, { status: 503 });
  }

  let body: { key?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  if (typeof body.key !== "string" || !KEY_RE.test(body.key)) {
    return NextResponse.json({ error: "BAD_KEY" }, { status: 400 });
  }

  try {
    const record = await getBackup(body.key);
    if (!record) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "STORAGE_ERROR" }, { status: 503 });
  }
}
