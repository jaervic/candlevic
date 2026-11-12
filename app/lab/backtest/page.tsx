import { Backtest } from "@/components/lab/backtest";

export const metadata = {
  alternates: { canonical: "/lab/backtest" },
  title: "Backtesting didáctico",
  description:
    "Compara comprar y mantener, cruce de medias y DCA sobre datos reales, con costes y drawdown.",
};

export default function BacktestPage() {
  return (
    <div className="space-y-8">
      <Backtest />
    </div>
  );
}
