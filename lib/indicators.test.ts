import { describe, expect, it } from "vitest";
import { atr, bollinger, ema, macd, rsi, sma, toCandles } from "./indicators";

describe("sma", () => {
  it("calcula la media móvil simple", () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]);
  });

  it("devuelve null si no hay suficientes datos", () => {
    expect(sma([1, 2], 3)).toEqual([null, null]);
  });
});

describe("ema", () => {
  it("se inicializa con la SMA del primer periodo", () => {
    expect(ema([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]);
  });

  it("responde más rápido que la SMA en una subida", () => {
    const values = [10, 10, 10, 10, 20, 20, 20];
    const e = ema(values, 4);
    const s = sma(values, 4);
    expect(e[6] as number).toBeGreaterThan(s[6] as number);
  });
});

describe("rsi", () => {
  it("marca 100 cuando todo son subidas", () => {
    const values = Array.from({ length: 20 }, (_, i) => 100 + i);
    const r = rsi(values, 14);
    expect(r[19]).toBeCloseTo(100, 5);
  });

  it("marca 0 cuando todo son bajadas", () => {
    const values = Array.from({ length: 20 }, (_, i) => 100 - i);
    const r = rsi(values, 14);
    expect(r[19]).toBeCloseTo(0, 5);
  });

  it("se mantiene entre 0 y 100", () => {
    const values = [44, 44.3, 44.1, 43.6, 44.4, 45, 45.6, 45.9, 46.1, 46.3, 46.0, 46.6, 47.1, 47.4, 47.2, 47.8];
    for (const v of rsi(values, 14)) {
      if (v != null) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("macd", () => {
  it("produce histograma cuando ambas líneas existen", () => {
    const values = Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 4) * 10);
    const { macd: line, signal, histogram } = macd(values);
    const idx = histogram.findIndex((v) => v != null);
    expect(idx).toBeGreaterThan(0);
    expect(line[idx]).not.toBeNull();
    expect(signal[idx]).not.toBeNull();
    expect(histogram[idx] as number).toBeCloseTo(
      (line[idx] as number) - (signal[idx] as number),
      10,
    );
  });
});

describe("bollinger", () => {
  it("las bandas envuelven la media", () => {
    const values = Array.from({ length: 40 }, (_, i) => 100 + (i % 7));
    const { middle, upper, lower } = bollinger(values, 20, 2);
    for (let i = 19; i < values.length; i++) {
      expect(upper[i] as number).toBeGreaterThan(middle[i] as number);
      expect(lower[i] as number).toBeLessThan(middle[i] as number);
    }
  });

  it("con serie constante las bandas colapsan", () => {
    const values = new Array(30).fill(50);
    const { middle, upper, lower } = bollinger(values, 20, 2);
    expect(upper[25]).toBeCloseTo(50, 10);
    expect(lower[25]).toBeCloseTo(50, 10);
    expect(middle[25]).toBeCloseTo(50, 10);
  });
});

describe("atr", () => {
  it("calcula el rango medio verdadero", () => {
    const candles = toCandles([
      [1, 10, 12, 9, 11, 100],
      [2, 11, 13, 10, 12, 100],
      [3, 12, 14, 11, 13, 100],
      [4, 13, 15, 12, 14, 100],
    ]);
    const result = atr(candles, 2);
    expect(result[2]).not.toBeNull();
    expect(result[2] as number).toBeGreaterThan(0);
  });
});
