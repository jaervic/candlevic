import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  LineChart,
  Wallet,
} from "lucide-react";
import { getStrategy, STRATEGIES } from "@/content/estrategias";
import { getLesson } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { StepList } from "@/components/lesson/callout";
import { DatasetChart } from "@/components/charts/dataset-chart";
import { PatternChart } from "@/components/lesson/pattern-chart";
import { FundingCalculator } from "@/components/lesson/funding-calculator";
import { Quiz } from "@/components/lesson/quiz";

type Params = { slug: string };

export function generateStaticParams() {
  return STRATEGIES.map((strategy) => ({ slug: strategy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) return { title: "Estrategia no encontrada" };
  return {
    title: `${strategy.name} — Estrategia`,
    description: strategy.summary,
    alternates: { canonical: `/aprender/estrategias/${slug}` },
  };
}

export default async function StrategyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) notFound();

  const related = strategy.related
    .map((relatedSlug) => getLesson(relatedSlug))
    .filter((lesson): lesson is NonNullable<typeof lesson> =>
      Boolean(lesson),
    );

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/aprender/estrategias"
        className="mb-3 inline-flex items-center gap-1.5 text-[11px] text-faint hover:text-muted"
      >
        <ArrowLeft className="h-3 w-3" /> Estrategias
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="accent">{strategy.familyLabel}</Badge>
        <Badge tone="outline">{strategy.difficulty}</Badge>
        <span className="text-[11px] text-faint">{strategy.horizon}</span>
      </div>

      <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight">
        {strategy.name}
      </h1>
      <p className="mt-1 text-[15px] font-medium text-muted">
        {strategy.tagline}
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-fg/90">
        {strategy.summary}
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-2xl border border-up/25 bg-up/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-up">
            Contexto ideal
          </p>
          <ul className="mt-2 space-y-1.5">
            {strategy.context.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[12px] leading-relaxed text-fg/90"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-up" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-down/25 bg-down/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-down">
            Cuándo no usarla
          </p>
          <ul className="mt-2 space-y-1.5">
            {strategy.avoid.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[12px] leading-relaxed text-fg/90"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-down" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mt-6 text-[16px] font-semibold">Las reglas</h2>
      <StepList
        steps={[
          {
            title: "Entrada",
            body: (
              <ul className="list-disc space-y-1 pl-4">
                {strategy.entry.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          },
          { title: "Stop", body: strategy.stop },
          {
            title: "Salida",
            body: (
              <ul className="list-disc space-y-1 pl-4">
                {strategy.exit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          },
          { title: "Tamaño", body: strategy.size },
        ]}
      />

      <h2 className="mt-6 text-[16px] font-semibold">
        Perfil de riesgo orientativo
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <RiskStat label="Acierto" value={strategy.risk.winRate} />
        <RiskStat label="R:B" value={strategy.risk.rr} />
        <RiskStat label="Drawdown" value={strategy.risk.drawdown} />
        <RiskStat label="Costes" value={strategy.risk.costs} />
      </div>
      <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
        Rangos orientativos, no una promesa. Dependen del activo, del periodo y
        de la ejecución.
      </p>

      <h2 className="mt-6 text-[16px] font-semibold">Errores comunes</h2>
      <ul className="mt-2 space-y-1.5">
        {strategy.mistakes.map((mistake) => (
          <li
            key={mistake}
            className="flex items-start gap-2 text-[12.5px] leading-relaxed text-fg/90"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {mistake}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-[16px] font-semibold">En el gráfico</h2>
      {strategy.chart.pattern && (
        <PatternChart
          type={strategy.chart.pattern}
          caption="Esquema idealizado. El patrón no garantiza la dirección; la confirmación la da el precio y el volumen."
        />
      )}
      <DatasetChart
        dataset={strategy.chart.dataset}
        from={strategy.chart.from}
        to={strategy.chart.to}
        height={260}
        overlays={strategy.chart.overlays}
        showVolume={strategy.chart.showVolume}
        showRsi={strategy.chart.showRsi}
        showBollinger={strategy.chart.showBollinger}
        showMacd={strategy.chart.showMacd}
        priceLines={strategy.chart.priceLines}
        markers={strategy.chart.markers}
        caption={strategy.chart.caption}
      />

      {strategy.slug === "carry-funding" && <FundingCalculator />}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {strategy.backtest ? (
          <Link
            href={`/lab/backtest?strategy=${strategy.backtest.strategy}&dataset=${strategy.backtest.dataset}`}
            className="flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-4 transition-colors hover:bg-accent/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">
              <LineChart className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wider text-accent">
                Probar
              </span>
              <span className="block text-[13px] font-medium">
                {strategy.backtest.label}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
          </Link>
        ) : (
          <Link
            href="/aprender/perpetuos-funding"
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
              <Calculator className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase tracking-wider text-faint">
                Entender el coste
              </span>
              <span className="block text-[13px] font-medium">
                Calculadora de funding
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
          </Link>
        )}

        <Link
          href="/demo"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
            <Wallet className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-wider text-faint">
              Practicar
            </span>
            <span className="block text-[13px] font-medium">
              Trading demo
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[13px] font-semibold">Lecciones relacionadas</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((lesson) => (
              <Link
                key={lesson.meta.slug}
                href={`/aprender/${lesson.meta.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {lesson.meta.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <h2 className="mt-6 text-[16px] font-semibold">Compruébalo</h2>
      <Quiz {...strategy.quiz} />

      <p className="mt-4 rounded-xl border border-line bg-surface p-3 text-[10.5px] leading-relaxed text-faint">
        Contenido educativo. No es una señal ni una recomendación. Los perfiles
        de riesgo son orientativos y los resultados pasados no garantizan los
        futuros.
      </p>
    </article>
  );
}

function RiskStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[9px] uppercase tracking-wider text-faint">{label}</p>
      <p className="num mt-0.5 text-[12px] font-medium leading-snug">{value}</p>
    </div>
  );
}
