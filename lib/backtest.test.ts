import { describe, expect, it } from "vitest";
import {
  BACKTEST_STRATEGIES,
  runAllBacktests,
  runBacktest,
} from "./backtest";
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

  it("Donchian compra una ruptura y vende al perder el mínimo", () => {
    const closes = [
      ...Array(25).fill(100),
      ...Array(10).fill(120),
      90,
      90,
    ];
    const result = runBacktest(series(closes), "donchian");
    expect(result.trades).toBeGreaterThan(0);
  });

  it("la reversión RSI compra en sobreventa y vende en sobrecompra", () => {
    const closes = [
      ...Array.from({ length: 30 }, (_, i) => 100 - i * 3),
      ...Array.from({ length: 30 }, (_, i) => 40 + i * 4),
    ];
    const result = runBacktest(series(closes), "rsi");
    expect(result.trades).toBeGreaterThan(0);
  });

  it("el pullback a media genera operaciones en una tendencia con retrocesos", () => {
    const closes = [
      ...Array.from({ length: 60 }, (_, i) => 100 + i),
      150, 140, 130, 140, 150, 160,
      170, 180, 190, 200,
      180, 160, 140, 120,
    ];
    const result = runBacktest(series(closes), "pullback");
    expect(result.trades).toBe(2);
    expect(result.equity).toHaveLength(closes.length);
  });

  it("el rango compra cerca del mínimo y vende cerca del máximo", () => {
    const closes = Array.from({ length: 220 }, (_, i) =>
      100 + Math.sin(i / 5) * 12,
    );
    const result = runBacktest(series(closes), "range");
    expect(result.trades).toBeGreaterThan(0);
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

  it("el slippage reduce el resultado de comprar y mantener", () => {
    const candles = series(Array.from({ length: 120 }, (_, i) => 100 + i));
    const without = runBacktest(candles, "hold");
    const withSlippage = runBacktest(candles, "hold", { slippage: 0.001 });
    expect(withSlippage.finalValue).toBeLessThan(without.finalValue);
    expect(without.trades).toBe(1);
  });

  it("acepta parámetros personalizados de Donchian y RSI", () => {
    const closes = Array.from({ length: 180 }, (_, i) =>
      100 + Math.sin(i / 6) * 12 + i * 0.1,
    );
    const candles = series(closes);
    const looseRsi = runBacktest(candles, "rsi", {
      rsiBuy: 45,
      rsiSell: 55,
    });
    const strictRsi = runBacktest(candles, "rsi", {
      rsiBuy: 20,
      rsiSell: 80,
    });
    expect(looseRsi.trades).toBeGreaterThan(strictRsi.trades);

    const fastDonchian = runBacktest(candles, "donchian", {
      donchianEntry: 5,
      donchianExit: 3,
    });
    expect(fastDonchian.trades).toBeGreaterThan(0);
    expect(fastDonchian.equity).toHaveLength(closes.length);
  });

  it("devuelve todas las estrategias", () => {
    const candles = series(Array.from({ length: 100 }, (_, i) => 100 + i));
    const results = runAllBacktests(candles);
    expect(results.map((result) => result.id)).toEqual(BACKTEST_STRATEGIES);
    for (const result of results) {
      expect(result.maxDrawdown).toBeGreaterThanOrEqual(0);
      expect(result.maxDrawdown).toBeLessThanOrEqual(100);
    }
  });
});
