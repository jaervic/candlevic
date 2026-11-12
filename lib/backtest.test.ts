import { describe, expect, it } from "vitest";
import { runAllBacktests, runBacktest } from "./backtest";
import { toCandles } from "./indicators";

function series(closes: number[]) {
  return toCandles(
    closes.map((close, i) => [
      1_700_000_000 + i * 86_400,
      close,
      close + 1,
      close - 1,
      close,
      1000,
    ]),
  );
}

describe("backtest", () => {
  it("comprar y mantener sube en una tendencia alcista", () => {
    const candles = series(Array.from({ length: 120 }, (_, i) => 100 + i));
    const result = runBacktest(candles, "hold");
    expect(result.equity).toHaveLength(120);
    expect(result.finalValue).toBeGreaterThan(10_000);
    expect(result.trades).toBe(1);
  });

  it("comprar y mantener baja en una tendencia bajista", () => {
    const candles = series(Array.from({ length: 120 }, (_, i) => 200 - i));
    const result = runBacktest(candles, "hold");
    expect(result.finalValue).toBeLessThan(10_000);
  });

  it("el cruce de medias genera operaciones", () => {
    const closes = Array.from({ length: 200 }, (_, i) =>
      100 + Math.sin(i / 8) * 20 + i * 0.2,
    );
    const result = runBacktest(series(closes), "sma");
    expect(result.trades).toBeGreaterThan(0);
    expect(result.equity).toHaveLength(200);
  });

  it("el DCA invierte periódicamente", () => {
    const candles = series(Array.from({ length: 120 }, (_, i) => 100 + i));
    const result = runBacktest(candles, "dca", {
      dcaAmount: 500,
      dcaEvery: 30,
    });
    expect(result.trades).toBe(4);
    expect(result.equity).toHaveLength(120);
  });

  it("devuelve las tres estrategias", () => {
    const candles = series(Array.from({ length: 100 }, (_, i) => 100 + i));
    const results = runAllBacktests(candles);
    expect(results.map((result) => result.id)).toEqual(["hold", "sma", "dca"]);
    for (const result of results) {
      expect(result.maxDrawdown).toBeGreaterThanOrEqual(0);
      expect(result.maxDrawdown).toBeLessThanOrEqual(100);
    }
  });
});
