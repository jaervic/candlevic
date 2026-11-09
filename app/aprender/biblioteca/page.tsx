import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BOOKS } from "@/content/biblioteca";
import { Badge } from "@/components/ui/badge";
import { LearnTabs } from "@/components/learn/learn-tabs";

export const metadata = {
  title: "Biblioteca",
  description:
    "Resúmenes originales de los libros clave del trading: Murphy, Nison, Elder, Douglas, Tharp y más.",
};

export default function BibliotecaPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Aprender
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Biblioteca</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Diez libros que explican el trading desde ángulos distintos. Fichas
          originales, con lo que aportan y lo que conviene cuestionar.
        </p>
      </header>

      <LearnTabs active="/aprender/biblioteca" />

      <div className="grid gap-2.5 sm:grid-cols-2">
        {BOOKS.map((book) => (
          <Link
            key={book.slug}
            href={`/aprender/biblioteca/${book.slug}`}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2/60"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `${book.accent}33`,
                  backgroundColor: `${book.accent}14`,
                  color: book.accent,
                }}
              >
                <BookOpen className="h-4 w-4" />
              </span>
              <Badge tone="outline">{book.level}</Badge>
            </div>
            <p className="mt-3 text-[13.5px] font-semibold leading-snug">
              {book.title}
            </p>
            <p className="mt-0.5 text-[11px] text-faint">
              {book.author} · {book.year}
            </p>
            <p className="mt-2 flex-1 text-[12px] leading-relaxed text-muted">
              {book.idea}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-accent">
              Ver ficha <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
