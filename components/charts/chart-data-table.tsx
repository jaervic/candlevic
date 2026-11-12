import type { Candle } from "@/lib/indicators";
import { formatNumber, formatPrice } from "@/lib/utils";

function formatTime(time: number, interval?: string) {
  const date = new Date(time * 1000);
  const intraday = interval ? /[mh]/.test(interval) : false;
  return new Intl.DateTimeFormat(
    "es-ES",
    intraday
      ? {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }
      : { day: "2-digit", month: "short", year: "2-digit" },
  ).format(date);
}

export function ChartDataTable({
  candles,
  interval,
  rows = 20,
}: {
  candles: Candle[];
  interval?: string;
  rows?: number;
}) {
  const slice = candles.slice(-rows);

  return (
    <div className="overflow-x-auto border-t border-line/70 bg-surface">
      <table className="w-full text-left text-[10px]">
        <caption className="sr-only">
          Últimas {slice.length} velas con apertura, máximo, mínimo, cierre y
          volumen
        </caption>
        <thead>
          <tr className="text-faint">
            <th scope="col" className="px-2 py-1.5 font-medium">
              Fecha
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium">
              Apertura
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium">
              Máximo
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium">
              Mínimo
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium">
              Cierre
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium">
              Volumen
            </th>
          </tr>
        </thead>
        <tbody>
          {slice.map((candle) => (
            <tr key={candle.time} className="border-t border-line/50">
              <td className="num px-2 py-1 text-muted">
                {formatTime(candle.time, interval)}
              </td>
              <td className="num px-2 py-1 text-right text-fg/90">
                {formatPrice(candle.open)}
              </td>
              <td className="num px-2 py-1 text-right text-fg/90">
                {formatPrice(candle.high)}
              </td>
              <td className="num px-2 py-1 text-right text-fg/90">
                {formatPrice(candle.low)}
              </td>
              <td className="num px-2 py-1 text-right text-fg/90">
                {formatPrice(candle.close)}
              </td>
              <td className="num px-2 py-1 text-right text-faint">
                {formatNumber(candle.volume, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
