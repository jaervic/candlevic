import Link from "next/link";
import { ArrowRight, LineChart, Wallet } from "lucide-react";
import { Lab } from "@/components/lab/lab";

export const metadata = {
  alternates: { canonical: "/lab" },
  title: "Laboratorio",
  description:
    "Practica con gráficos interactivos: indicadores, replay de velas y líneas horizontales. Sin dinero real.",
};

export default function LabPage() {
  return (
    <div className="space-y-4">
      <Lab />
      <Link
        href="/lab/backtest"
        className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info">
          <LineChart className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-faint">
            Analiza
          </span>
          <span className="block text-[14px] font-medium">
            Backtesting didáctico
          </span>
          <span className="block text-[11px] text-muted">
            Comprar y mantener vs. cruce de medias vs. DCA
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
      </Link>
      <Link
        href="/demo"
        className="flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-4 transition-colors hover:bg-accent/15"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent">
          <Wallet className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-accent">
            Siguiente paso
          </span>
          <span className="block text-[14px] font-medium">
            Practica con una cartera virtual
          </span>
          <span className="block text-[11px] text-muted">
            10.000 $ de prueba, P&L y diario emocional
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
      </Link>
    </div>
  );
}
