import Link from "next/link";
import { ArrowRight, BookMarked, FlaskConical, LineChart } from "lucide-react";
import { getDocs } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { LearnTabs } from "@/components/learn/learn-tabs";

export const metadata = {
  title: "Estudios",
  description:
    "Casos históricos y evidencia científica sobre trading: LUNA, COVID, Barber & Odean, SPIVA y más.",
};

export default function EstudiosPage() {
  const docs = getDocs("estudios");
  const casos = docs.filter((d) => d.meta.kind === "caso");
  const evidencia = docs.filter((d) => d.meta.kind === "evidencia");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Aprender
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Estudios</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Lo que pasó de verdad y lo que dice la investigación. Sin anécdotas de
          redes sociales.
        </p>
      </header>

      <LearnTabs active="/aprender/estudios" />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <LineChart className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">Casos históricos</h2>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {casos.map((doc) => (
            <Link
              key={doc.meta.slug}
              href={`/aprender/estudios/${doc.meta.slug}`}
              className="group rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2/60"
            >
              <div className="flex items-center gap-2">
                <Badge tone="accent">Caso</Badge>
                <span className="text-[10px] text-faint">{doc.meta.minutes} min</span>
              </div>
              <p className="mt-2 text-[14px] font-medium leading-snug">
                {doc.meta.title}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                {doc.meta.summary}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-accent">
                Leer el caso <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-info" />
          <h2 className="text-sm font-semibold">Evidencia científica</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {evidencia.map((doc, i) => (
            <Link
              key={doc.meta.slug}
              href={`/aprender/estudios/${doc.meta.slug}`}
              className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60 ${
                i > 0 ? "border-t border-line/70" : ""
              }`}
            >
              <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug">{doc.meta.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">
                  {doc.meta.source ?? doc.meta.summary}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-faint">
                {doc.meta.minutes} min
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
