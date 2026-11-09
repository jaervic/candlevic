"use client";

import type { ProgressData } from "./progress";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export type EncryptedPayload = {
  v: 1;
  salt: string;
  iv: string;
  ct: string;
};

export function generateCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return [
    chars.slice(0, 4).join(""),
    chars.slice(4, 8).join(""),
    chars.slice(8, 12).join(""),
  ].join("-");
}

export function normalizeCode(code: string) {
  return code
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(code: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(normalizeCode(code)),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 210_000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function hashCode(code: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`candlevic:${normalizeCode(code)}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function encryptProgress(
  code: string,
  data: ProgressData,
): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(code, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    key,
    plaintext,
  );
  return {
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptProgress(
  code: string,
  payload: EncryptedPayload,
): Promise<ProgressData> {
  const key = await deriveKey(code, fromBase64(payload.salt));
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(payload.iv) as unknown as BufferSource },
    key,
    fromBase64(payload.ct) as unknown as BufferSource,
  );
  return JSON.parse(new TextDecoder().decode(plaintext)) as ProgressData;
}

export type BackupResult =
  | { ok: true; updatedAt?: string }
  | { ok: false; error: string };

export async function saveBackup(
  code: string,
  data: ProgressData,
): Promise<BackupResult> {
  try {
    const key = await hashCode(code);
    const payload = await encryptProgress(code, data);
    const res = await fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, payload }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        ok: false,
        error:
          body?.error === "KV_NOT_CONFIGURED"
            ? "El respaldo en la nube no está configurado en este servidor. Usa exportar archivo."
            : "No se pudo guardar el respaldo. Inténtalo de nuevo.",
      };
    }
    return { ok: true, updatedAt: new Date().toISOString() };
  } catch {
    return { ok: false, error: "Error de red al guardar el respaldo." };
  }
}

export async function loadBackup(
  code: string,
): Promise<
  | { ok: true; data: ProgressData; updatedAt?: string }
  | { ok: false; error: string }
> {
  try {
    const key = await hashCode(code);
    const res = await fetch("/api/progress/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (res.status === 404) {
      return {
        ok: false,
        error: "No existe ningún respaldo con ese código. Revísalo.",
      };
    }
    if (!res.ok) {
      return { ok: false, error: "No se pudo recuperar el respaldo." };
    }
    const body = (await res.json()) as {
      payload: EncryptedPayload;
      updatedAt?: string;
    };
    const data = await decryptProgress(code, body.payload);
    return { ok: true, data, updatedAt: body.updatedAt };
  } catch {
    return {
      ok: false,
      error: "Código incorrecto o respaldo dañado. No se pudo descifrar.",
    };
  }
}
