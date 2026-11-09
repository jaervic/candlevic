import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock } from "lucide-react";
import { getDoc, getDocs } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Callout, KeyIdea } from "@/components/lesson/callout";
import { Disclaimer } from "@/components/disclaimer";

type Params = { slug: string };

export function generateStaticParams() {
  return getDocs("radar").map((doc) => ({ slug: doc.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDoc("radar", slug);
  if (!doc) return { title: "Explicador no encontrado" };
  return { title: doc.meta.title, description: doc.meta.summary };
}

export default async function ExplicadorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const doc = getDoc("radar", slug);
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/radar?tab=explicadores"
        className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-faint hover:text-muted"
      >
        <ArrowLeft className="h-3 w-3" /> Explicadores
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="accent">Explicador</Badge>
        <span className="flex items-center gap-1 text-[11px] text-faint">
          <Clock className="h-3 w-3" /> {doc.meta.minutes} min
        </span>
        {doc.meta.tags.map((tag) => (
          <Badge key={tag} tone="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight">
        {doc.meta.title}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{doc.meta.summary}</p>

      <div className="prose-cv mt-6">
        <MDXRemote
          source={doc.content}
          components={{
            Callout,
            KeyIdea,
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
          }}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <div className="mt-8 border-t border-line pt-4">
        <Disclaimer />
      </div>
    </article>
  );
}
