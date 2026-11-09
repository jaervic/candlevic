"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayKey } from "./utils";

export type LessonProgress = {
  status: "started" | "completed";
  quizScore?: number;
  at: number;
};

export type ProgressData = {
  lessons: Record<string, LessonProgress>;
  streak: { current: number; lastDay: string };
  profile: string | null;
  savedCode: string | null;
  startedAt: number;
};

type ProgressActions = {
  start: (slug: string) => void;
  complete: (slug: string, quizScore?: number) => void;
  recordQuiz: (slug: string, score: number) => void;
  setProfile: (profile: string) => void;
  setSavedCode: (code: string | null) => void;
  merge: (remote: Partial<ProgressData>) => void;
  importState: (state: unknown) => boolean;
  reset: () => void;
};

export type ProgressStore = ProgressData & ProgressActions;

const initialState: ProgressData = {
  lessons: {},
  streak: { current: 0, lastDay: "" },
  profile: null,
  savedCode: null,
  startedAt: Date.now(),
};

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

function nextStreak(
  streak: { current: number; lastDay: string },
): { current: number; lastDay: string } {
  const today = todayKey();
  if (streak.lastDay === today) return streak;
  if (streak.lastDay === yesterdayKey()) {
    return { current: streak.current + 1, lastDay: today };
  }
  return { current: 1, lastDay: today };
}

function mergeLesson(
  a?: LessonProgress,
  b?: LessonProgress,
): LessonProgress | undefined {
  if (!a) return b;
  if (!b) return a;
  const status =
    a.status === "completed" || b.status === "completed" ? "completed" : "started";
  const quizScore = Math.max(a.quizScore ?? 0, b.quizScore ?? 0);
  return {
    status,
    quizScore: quizScore > 0 ? quizScore : undefined,
    at: Math.max(a.at, b.at),
  };
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      start: (slug) => {
        const current = get().lessons[slug];
        if (current) return;
        set((state) => ({
          lessons: {
            ...state.lessons,
            [slug]: { status: "started", at: Date.now() },
          },
        }));
      },

      complete: (slug, quizScore) => {
        set((state) => {
          const current = state.lessons[slug];
          const best = Math.max(current?.quizScore ?? 0, quizScore ?? 0);
          return {
            lessons: {
              ...state.lessons,
              [slug]: {
                status: "completed",
                quizScore: best > 0 ? best : undefined,
                at: Date.now(),
              },
            },
            streak: nextStreak(state.streak),
          };
        });
      },

      recordQuiz: (slug, score) => {
        set((state) => {
          const current = state.lessons[slug];
          const best = Math.max(current?.quizScore ?? 0, score);
          return {
            lessons: {
              ...state.lessons,
              [slug]: {
                status: current?.status ?? "started",
                quizScore: best > 0 ? best : undefined,
                at: current?.at ?? Date.now(),
              },
            },
          };
        });
      },

      setProfile: (profile) => set({ profile }),

      setSavedCode: (savedCode) => set({ savedCode }),

      merge: (remote) => {
        set((state) => {
          const lessons = { ...state.lessons };
          for (const [slug, progress] of Object.entries(remote.lessons ?? {})) {
            lessons[slug] = mergeLesson(lessons[slug], progress) as LessonProgress;
          }
          const remoteStreak = remote.streak ?? state.streak;
          const streak =
            remoteStreak.current > state.streak.current
              ? remoteStreak
              : state.streak;
          return {
            lessons,
            streak,
            profile: state.profile ?? remote.profile ?? null,
            startedAt: Math.min(
              state.startedAt || Date.now(),
              remote.startedAt || Date.now(),
            ),
          };
        });
      },

      importState: (state) => {
        if (!state || typeof state !== "object") return false;
        const candidate = state as Partial<ProgressData>;
        if (!candidate.lessons || typeof candidate.lessons !== "object") {
          return false;
        }
        get().merge(candidate);
        return true;
      },

      reset: () =>
        set({
          ...initialState,
          startedAt: Date.now(),
          savedCode: get().savedCode,
        }),
    }),
    {
      name: "candlevic-progress-v1",
      version: 1,
    },
  ),
);

export function lessonXp(progress?: LessonProgress) {
  if (!progress || progress.status !== "completed") return 0;
  return 20 + Math.round((progress.quizScore ?? 0) / 10);
}

export function totalXp(lessons: Record<string, LessonProgress>) {
  return Object.values(lessons).reduce((sum, p) => sum + lessonXp(p), 0);
}

export function completedCount(lessons: Record<string, LessonProgress>) {
  return Object.values(lessons).filter((p) => p.status === "completed").length;
}

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / 100) + 1;
  const current = xp % 100;
  return { level, current, next: 100, progress: current };
}

export function exportProgress(state: ProgressData) {
  return JSON.stringify(
    {
      app: "candlevic",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: state,
    },
    null,
    2,
  );
}
