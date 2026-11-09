import type { ProgressData } from "./progress";
import { todayKey } from "./utils";

/**
 * Respaldo autónomo: el progreso viaja dentro del propio código.
 * No necesita servidor, cuenta ni conexión.
 *
 * Cada lección se identifica con una huella estable de 16 bits derivada
 * de su slug, así que reordenar o añadir lecciones no rompe códigos antiguos.
 */

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const PREFIX = "CNDL1";

const PROFILE_CODES: Record<string, number> = {
  scalping: 1,
  day: 2,
  swing: 3,
  position: 4,
};
const CODE_PROFILES = ["", "scalping", "day", "swing", "position"];

function fingerprint(slug: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 16) & 0xffff;
}

function buildIndex(lessonSlugs: string[]) {
  const byFingerprint = new Map<number, string>();
  const bySlug = new Map<string, number>();
  for (const slug of lessonSlugs) {
    const print = fingerprint(slug);
    if (byFingerprint.has(print)) {
      throw new Error(
        `Colisión de huella de respaldo entre "${slug}" y "${byFingerprint.get(print)}"`,
      );
    }
    byFingerprint.set(print, slug);
    bySlug.set(slug, print);
  }
  return { byFingerprint, bySlug };
}

function base32Encode(bytes: number[]): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input: string): number[] | null {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of input) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) return null;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return out;
}

export function isSelfContainedCode(code: string) {
  const clean = code.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return clean.startsWith(PREFIX) && clean.length > 12;
}

export function encodeBackup(
  data: ProgressData,
  lessonSlugs: string[],
): string {
  const { bySlug } = buildIndex(lessonSlugs);

  const completed = Object.entries(data.lessons).filter(
    ([slug, progress]) => progress.status === "completed" && bySlug.has(slug),
  );

  const profile = data.profile ? (PROFILE_CODES[data.profile] ?? 0) : 0;
  const bytes: number[] = [
    1,
    profile,
    Math.min(255, data.streak.current),
    Math.min(255, completed.length),
  ];

  for (const [slug, progress] of completed) {
    const print = bySlug.get(slug) as number;
    bytes.push(
      print >> 8,
      print & 0xff,
      Math.max(0, Math.min(100, Math.round(progress.quizScore ?? 0))),
    );
  }

  const checksum = bytes.reduce((sum, byte) => sum + byte, 0) & 0xff;
  bytes.push(checksum);

  const encoded = base32Encode(bytes);
  const groups = encoded.match(/.{1,8}/g) ?? [];
  return `${PREFIX}-${groups.join("-")}`;
}

export function decodeBackup(
  code: string,
  lessonSlugs: string[],
): ProgressData | null {
  const clean = code.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (!clean.startsWith(PREFIX)) return null;

  const bytes = base32Decode(clean.slice(PREFIX.length));
  if (!bytes || bytes.length < 5) return null;

  const body = bytes.slice(0, -1);
  const checksum = bytes[bytes.length - 1];
  if ((body.reduce((sum, byte) => sum + byte, 0) & 0xff) !== checksum) {
    return null;
  }

  if (body[0] !== 1) return null;

  const profileCode = body[1];
  const streak = body[2];
  const count = body[3];

  if (body.length !== 4 + count * 3) return null;

  const { byFingerprint } = buildIndex(lessonSlugs);
  const lessons: ProgressData["lessons"] = {};

  for (let i = 0; i < count; i++) {
    const print = (body[4 + i * 3] << 8) | body[5 + i * 3];
    const score = body[6 + i * 3];
    const slug = byFingerprint.get(print);
    if (!slug) return null;
    lessons[slug] = {
      status: "completed",
      quizScore: score > 0 ? score : undefined,
      at: Date.now(),
    };
  }

  return {
    lessons,
    streak: { current: streak, lastDay: todayKey() },
    profile: CODE_PROFILES[profileCode] ?? null,
    startedAt: Date.now(),
    savedCode: null,
  };
}
