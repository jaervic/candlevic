import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock } from "lucide-react";
import { getDoc, getDocs } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Callout, KeyIdea, StepList } from "@/components/lesson/callout";
import { Quiz } from "@/components/lesson/quiz";
import { DatasetChart } from "@/components/charts/dataset-chart";
import { Disclaimer } from "@/components/disclaimer";

type Params = { slug: string };

export function generateStaticParams() {
  return getDocs("estudios").map((doc) => ({ slug: doc.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDoc("estudios", slug);
  if (!doc) return { title: "Estudio no encontrado" };
  return { title: doc.meta.title, description: doc.meta.summary };
}

export default async function EstudioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getDoc("estudios", slug);
  if (!doc) notFound();

  const isCase = doc.meta.kind === "caso";

  const components = {
    Callout,
    KeyIdea,
    StepList,
    DatasetChart,
    Quiz: (props: React.ComponentProps<typeof Quiz>) => (
      <Quiz {...props} slug={slug} />
    ),
    a: ({ href = "", children, ...rest }: React.ComponentProps<"a">) =>
      href.startsWith("/") ? (
        <Link href={href} {...rest}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      ),
  };

  return (
    <article className="reading-shell">
      <Link
        href="/aprender/estudios"
        className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-faint hover:text-muted"
      >
        <ArrowLeft className="h-3 w-3" /> Estudios
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={isCase ? "accent" : "info"}>
          {isCase ? "Caso histórico" : "Evidencia"}
        </Badge>
        <span className="flex items-center gap-1 text-[11px] text-faint">
          <Clock className="h-3 w-3" /> {doc.meta.minutes} min
        </span>
        <Badge tone="outline">{doc.meta.level}</Badge>
      </div>

      <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight">
        {doc.meta.title}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{doc.meta.summary}</p>

      {doc.meta.source && (
        <p className="mt-3 rounded-xl border border-line bg-surface px-3 py-2 text-[11px] text-muted">
          <span className="text-faint">Fuente: </span>
          {doc.meta.source}
        </p>
      )}

      <div className="prose-cv mt-6">
        <MDXRemote
          source={doc.content}
          components={components}
          options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <div className="mt-8 border-t border-line pt-4">
        <Disclaimer />
      </div>
    </article>
  );
}
