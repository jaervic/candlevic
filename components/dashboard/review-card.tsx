"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useHydrated } from "@/lib/use-hydrated";
import { useProgress } from "@/lib/progress";
import { getReviewQueue, type ReviewCatalogItem } from "@/lib/review";

export function ReviewCard({ catalog }: { catalog: ReviewCatalogItem[] }) {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);
  const confidence = useProgress((s) => s.confidence) ?? {};

  if (!hydrated) return null;

  const queue = getReviewQueue(lessons, confidence, catalog);
  if (queue.length === 0) return null;

  return (
    <section className="rounded-2xl border border-info/25 bg-info/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-info" />
          <h2 className="text-sm font-semibold">Repaso de hoy</h2>
        </div>
        <span className="rounded-full border border-info/25 bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
          {queue.length} pendientes
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">
        Vuelve a lo que estás a punto de olvidar. Cinco minutos bastan.
      </p>
      <ul className="mt-2 space-y-0.5">
        {queue.slice(0, 3).map((item) => (
          <li key={item.slug}>
            <Link
              href={`/aprender/${item.slug}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors hover:bg-surface-2"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              <span className="num shrink-0 text-[10px] text-faint">
                {item.score != null ? `${item.score}%` : "sin quiz"}
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 text-faint" />
            </Link>
          </li>
        ))}
      </ul>
      {queue.length > 3 && (
        <p className="mt-1.5 text-[10px] text-faint">
          y {queue.length - 3} más en tu progreso.
        </p>
      )}
    </section>
  );
}
