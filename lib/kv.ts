import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

const DEV_FILE = path.join(process.cwd(), ".data", "progress-backups.json");
const TTL_SECONDS = 60 * 60 * 24 * 730; // 2 años

type BackupRecord = {
  payload: unknown;
  updatedAt: string;
};

async function readDevStore(): Promise<Record<string, BackupRecord>> {
  try {
    const raw = await fs.readFile(DEV_FILE, "utf8");
    return JSON.parse(raw) as Record<string, BackupRecord>;
  } catch {
    return {};
  }
}

export function kvConfigured() {
  return Boolean(redis) || process.env.NODE_ENV !== "production";
}

export async function setBackup(key: string, payload: unknown) {
  const record: BackupRecord = { payload, updatedAt: new Date().toISOString() };

  if (redis) {
    await redis.set(`candlevic:backup:${key}`, JSON.stringify(record), {
      ex: TTL_SECONDS,
    });
    return record.updatedAt;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("KV_NOT_CONFIGURED");
  }

  const store = await readDevStore();
  store[key] = record;
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(store));
  return record.updatedAt;
}

export async function getBackup(key: string): Promise<BackupRecord | null> {
  if (redis) {
    const raw = await redis.get<string>(`candlevic:backup:${key}`);
    if (!raw) return null;
    return typeof raw === "string"
      ? (JSON.parse(raw) as BackupRecord)
      : (raw as BackupRecord);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("KV_NOT_CONFIGURED");
  }

  const store = await readDevStore();
  return store[key] ?? null;
}
