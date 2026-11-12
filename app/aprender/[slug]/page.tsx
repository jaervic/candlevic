import Link from "next/link";
import { isValidElement } from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ChevronRight, Clock, Target } from "lucide-react";
import { getLesson, getLessonNeighbours, getLessons } from "@/lib/content";
import { MODULE_MAP } from "@/content/modulos";
import { Badge } from "@/components/ui/badge";
import { Callout, KeyIdea, StepList } from "@/components/lesson/callout";
import { Quiz } from "@/components/lesson/quiz";
import { RiskCalculator } from "@/components/lesson/risk-calculator";
import { DatasetChart } from "@/components/charts/dataset-chart";
import { ChartQuiz } from "@/components/charts/chart-quiz";
import { LessonActions } from "@/components/lesson/lesson-actions";
import { LessonReadingBar } from "@/components/lesson/lesson-reading-bar";
import { LessonToc } from "@/components/lesson/lesson-toc";
import { Scenario } from "@/components/lesson/scenario";
import { PlanBuilder } from "@/components/lesson/plan-builder";
import { LiquidationCalculator } from "@/components/lesson/liquidation-calculator";
import { FundingCalculator } from "@/components/lesson/funding-calculator";
import { PatternChart } from "@/components/lesson/pattern-chart";
import { Term } from "@/components/lesson/term";
import { slugify } from "@/lib/utils";

type Params = { slug: string };

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  if (isValidElement<{ children?: React.ReactNode }>(children)) {
    return textFromChildren(children.props.children);
  }
  return "";
}

export function generateStaticParams() {
  return getLessons().map((lesson) => ({ slug: lesson.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lección no encontrada" };
  return {
    title: lesson.meta.title,
    description: lesson.meta.summary,
    alternates: { canonical: `/aprender/${slug}` },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const { meta, content, headings } = lesson;
  const module = MODULE_MAP[meta.module];
  const { prev, next } = getLessonNeighbours(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: meta.title,
    description: meta.summary,
    learningResourceType: "Lesson",
    educationalLevel: meta.level,
    timeRequired: `PT${meta.minutes}M`,
    inLanguage: "es",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Course",
      name: "Candlevic",
      url: "https://candlevic.com",
    },
    url: `https://candlevic.com/aprender/${slug}`,
  };

  const components = {
    Callout,
    KeyIdea,
    StepList,
    RiskCalculator,
    DatasetChart,
    Scenario,
    PlanBuilder,
    LiquidationCalculator,
    FundingCalculator,
    PatternChart,
    Term,
    h2: ({ children, ...rest }: React.ComponentProps<"h2">) => (
      <h2
        {...rest}
        id={slugify(textFromChildren(children))}
        className="scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }: React.ComponentProps<"h3">) => (
      <h3
        {...rest}
        id={slugify(textFromChildren(children))}
        className="scroll-mt-24"
      >
        {children}
      </h3>
    ),
    Quiz: (props: React.ComponentProps<typeof Quiz>) => (
      <Quiz {...props} slug={slug} />
    ),
    ChartQuiz: (props: React.ComponentProps<typeof ChartQuiz>) => (
      <ChartQuiz {...props} slug={slug} />
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
    <div className="lg:mx-auto lg:grid lg:max-w-[980px] lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <LessonToc headings={headings} />
      <article className="reading-shell lg:mx-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LessonReadingBar />

      <nav className="mb-4 flex items-center gap-1 text-[11px] text-faint">
        <Link href="/aprender" className="hover:text-muted">
          Aprender
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/aprender#${module.id}`} className="hover:text-muted">
          {module.short}
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{module.title}</Badge>
          <span className="flex items-center gap-1 text-[11px] text-faint">
            <Clock className="h-3 w-3" /> {meta.minutes} min
          </span>
          <Badge tone="outline">{meta.level}</Badge>
        </div>

        <h1 className="mt-3 text-[27px] font-semibold leading-tight tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{meta.summary}</p>
      </header>

      {meta.objectives.length > 0 && (
        <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Al terminar sabrás
            </p>
          </div>
          <ul className="space-y-1.5">
            {meta.objectives.map((objective) => (
              <li
                key={objective}
                className="flex items-start gap-2 text-[12.5px] leading-snug text-fg/90"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="prose-cv mt-7">
        <MDXRemote
          source={content}
          components={components}
          options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <LessonActions
        slug={slug}
        next={next ? { slug: next.meta.slug, title: next.meta.title } : null}
        prev={prev ? { slug: prev.meta.slug, title: prev.meta.title } : null}
      />
      </article>
    </div>
  );
}
