import { Backtest } from "@/components/lab/backtest";
import { Disclaimer } from "@/components/disclaimer";

export const metadata = {
  title: "Backtesting didáctico",
  description:
    "Compara comprar y mantener, cruce de medias y DCA sobre datos reales, con costes y drawdown.",
};

export default function BacktestPage() {
  return (
    <div className="space-y-8">
      <Backtest />
      <footer className="border-t border-line pt-4">
        <Disclaimer />
      </footer>
    </div>
  );
}
