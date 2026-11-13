import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Check, Lightbulb, Link2 } from "lucide-react";
import { BOOKS, getBook } from "@/content/biblioteca";
import { MODULE_MAP, type ModuleId } from "@/content/modulos";
import { Badge } from "@/components/ui/badge";

type Params = { slug: string };

export function generateStaticParams() {
  return BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Libro no encontrado" };
  return {
    title: `${book.title} — ${book.author}`,
    description: book.idea,
  };
}

export default async function LibroPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/aprender/biblioteca"
        className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-faint hover:text-muted"
      >
        <ArrowLeft className="h-3 w-3" /> Biblioteca
      </Link>

      <div className="flex items-center gap-2">
        <Badge tone="accent">Ficha de libro</Badge>
        <Badge tone="outline">{book.level}</Badge>
      </div>

      <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight">
        {book.title}
      </h1>
      <p className="mt-1 text-[13px] text-muted">
        {book.author} · {book.year}
      </p>

      <div
        className="mt-5 rounded-2xl border p-4"
        style={{
          borderColor: `${book.accent}33`,
          backgroundColor: `${book.accent}0f`,
        }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: book.accent }} />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Idea central
          </p>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-fg">{book.idea}</p>
      </div>

      <h2 className="mt-6 text-[15px] font-semibold">Cinco conceptos clave</h2>
      <ul className="mt-3 space-y-2.5">
        {book.keys.map((key, i) => (
          <li key={key} className="flex gap-2.5">
            <span className="num mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 text-[10px] text-accent">
              {i + 1}
            </span>
            <span className="text-[13px] leading-relaxed text-fg/90">{key}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2.5 rounded-2xl border border-accent/25 bg-accent/10 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Qué cuestionar
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-fg/85">
            {book.critique}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-muted" />
          <h2 className="text-[13px] font-semibold">Conecta con la ruta</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {book.modules.map((id) => {
            const moduleMeta = MODULE_MAP[id as ModuleId];
            if (!moduleMeta) return null;
            return (
              <Link
                key={id}
                href={`/aprender#${id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <Check className="h-3 w-3 text-up" />
                {moduleMeta.title}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="mt-8 rounded-xl border border-line bg-surface p-3 text-[10.5px] leading-relaxed text-faint">
        Esta ficha es un resumen original y educativo. No reproduce texto del libro
        ni sustituye su lectura. Los derechos pertenecen a sus autores y editoriales.
      </p>
    </article>
  );
}
