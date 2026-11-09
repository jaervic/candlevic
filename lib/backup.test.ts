import { describe, expect, it } from "vitest";
import {
  decryptProgress,
  encryptProgress,
  generateCode,
  hashCode,
  normalizeCode,
} from "./backup";
import type { ProgressData } from "./progress";

const sample: ProgressData = {
  lessons: {
    velas: { status: "completed", quizScore: 100, at: 1700000000000 },
  },
  streak: { current: 3, lastDay: "2026-11-08" },
  profile: "swing",
  savedCode: "TEST-TEST-TEST",
  startedAt: 1700000000000,
};

describe("código de guardado", () => {
  it("genera códigos con el formato esperado", () => {
    const code = generateCode();
    expect(code).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
  });

  it("normaliza mayúsculas, guiones y caracteres ambiguos", () => {
    expect(normalizeCode("cndv-7k2m-9qx4")).toBe("CNDV7K2M9QX4");
    expect(normalizeCode("OI-L1")).toBe("0111");
  });

  it("cifra y descifra el progreso con el mismo código", async () => {
    const code = "CNDL-7K2M-9QX4";
    const payload = await encryptProgress(code, sample);
    expect(payload.ct).not.toContain("velas");
    const restored = await decryptProgress(code, payload);
    expect(restored).toEqual(sample);
  });

  it("falla al descifrar con otro código", async () => {
    const payload = await encryptProgress("CNDL-7K2M-9QX4", sample);
    await expect(
      decryptProgress("CNDL-0000-0000", payload),
    ).rejects.toBeTruthy();
  });

  it("el hash no revela el código", async () => {
    const hash = await hashCode("CNDL-7K2M-9QX4");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain("CNDL");
  });
});
