import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { STRATEGIES } from "@/content/estrategias";
import { StrategyExplorer } from "@/components/strategies/strategy-explorer";
import { LearnTabs } from "@/components/learn/learn-tabs";

export const metadata = {
  title: "Estrategias de trading",
  description:
    "Ocho marcos de decisión con reglas, contexto, errores y backtest: tendencia, ruptura, reversión, rango, DCA y carry.",
  alternates: { canonical: "/aprender/estrategias" },
};

export default function EstrategiasPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Aprender
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Estrategias
        </h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Ocho marcos de decisión con reglas, contexto y fallos conocidos. No son
          señales: son formas de ordenar una idea y comprobarla.
        </p>
      </header>

      <LearnTabs active="/aprender/estrategias" />

      <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 p-3">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-medium text-fg">
            Marcos de decisión, no señales.
          </span>{" "}
          Cada ficha explica cuándo funciona y cuándo falla. Úsala para estudiar,
          hacer backtest y practicar en el simulador, no para copiar.
        </p>
      </div>

      <StrategyExplorer strategies={STRATEGIES} />

      <Link
        href="/test"
        className="flex items-center gap-3 rounded-2xl border border-info/25 bg-info/10 p-4 transition-colors hover:bg-info/15"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-info">
            Si no sabes por dónde empezar
          </span>
          <span className="block text-[14px] font-medium">
            ¿Qué estrategia encaja contigo?
          </span>
          <span className="block text-[11px] text-muted">
            Test de perfil con plan de 30 días
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-info" />
      </Link>
    </div>
  );
}
