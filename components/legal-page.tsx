import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="reading-shell">
      <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
        Candlevic
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-[11px] text-faint">
        Última actualización: {updated}
      </p>
      <div className="prose-cv mt-5">{children}</div>
    </article>
  );
}
