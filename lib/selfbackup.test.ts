import { describe, expect, it } from "vitest";
import { decodeBackup, encodeBackup, isSelfContainedCode } from "./selfbackup";
import type { ProgressData } from "./progress";

const slugs = ["a", "b", "c", "d", "e"];

const data: ProgressData = {
  lessons: {
    a: { status: "completed", quizScore: 100, at: 1 },
    c: { status: "completed", quizScore: 40, at: 1 },
    d: { status: "started", at: 1 },
  },
  streak: { current: 5, lastDay: "2026-11-08" },
  profile: "swing",
  savedCode: null,
  startedAt: 1,
};

describe("código autónomo", () => {
  it("codifica y decodifica el progreso", () => {
    const code = encodeBackup(data, slugs);
    expect(isSelfContainedCode(code)).toBe(true);

    const decoded = decodeBackup(code, slugs);
    expect(decoded).not.toBeNull();
    expect(decoded?.lessons.a.status).toBe("completed");
    expect(decoded?.lessons.a.quizScore).toBe(100);
    expect(decoded?.lessons.c.quizScore).toBe(40);
    expect(decoded?.lessons.d).toBeUndefined();
    expect(decoded?.streak.current).toBe(5);
    expect(decoded?.profile).toBe("swing");
  });

  it("sigue funcionando si cambia el orden de las lecciones", () => {
    const code = encodeBackup(data, slugs);
    const decoded = decodeBackup(code, [...slugs].reverse());
    expect(decoded?.lessons.a.quizScore).toBe(100);
    expect(decoded?.lessons.c.quizScore).toBe(40);
  });

  it("detecta un código corrupto", () => {
    const code = encodeBackup(data, slugs);
    const corrupted = code.slice(0, -1) + (code.endsWith("0") ? "1" : "0");
    expect(decodeBackup(corrupted, slugs)).toBeNull();
  });

  it("rechaza códigos que no son autónomos", () => {
    expect(isSelfContainedCode("CNDL-7K2M-9QX4")).toBe(false);
    expect(decodeBackup("CNDL-7K2M-9QX4", slugs)).toBeNull();
  });
});
