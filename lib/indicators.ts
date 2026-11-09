export type RawCandle = [number, number, number, number, number, number];

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type SeriesPoint = { time: number; value: number };

export function toCandles(raw: RawCandle[]): Candle[] {
  return raw.map(([time, open, high, low, close, volume]) => ({
    time,
    open,
    high,
    low,
    close,
    volume,
  }));
}

/** Simple moving average. Returns null while there is not enough data. */
export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

/** Exponential moving average, seeded with the SMA of the first period. */
export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (period <= 0 || values.length < period) return out;
  const k = 2 / (period + 1);
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

/** Relative Strength Index (Wilder smoothing). */
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length <= period) return out;

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;

  const value = (g: number, l: number) =>
    l === 0 ? 100 : 100 - 100 / (1 + g / l);

  out[period] = value(avgGain, avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const g = diff > 0 ? diff : 0;
    const l = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = value(avgGain, avgLoss);
  }
  return out;
}

export type MacdResult = {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
};

export function macd(
  values: number[],
  fast = 12,
  slow = 26,
  signalPeriod = 9,
): MacdResult {
  const fastEma = ema(values, fast);
  const slowEma = ema(values, slow);

  const macdLine: (number | null)[] = values.map((_, i) =>
    fastEma[i] != null && slowEma[i] != null
      ? (fastEma[i] as number) - (slowEma[i] as number)
      : null,
  );

  const firstIndex = macdLine.findIndex((v) => v != null);
  const signal: (number | null)[] = new Array(values.length).fill(null);
  const histogram: (number | null)[] = new Array(values.length).fill(null);

  if (firstIndex !== -1) {
    const compact = macdLine.slice(firstIndex) as number[];
    const signalCompact = ema(compact, signalPeriod);
    for (let i = 0; i < compact.length; i++) {
      const idx = firstIndex + i;
      signal[idx] = signalCompact[i];
      if (signalCompact[i] != null) {
        histogram[idx] = compact[i] - (signalCompact[i] as number);
      }
    }
  }

  return { macd: macdLine, signal, histogram };
}

export type BollingerResult = {
  middle: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
};

export function bollinger(
  values: number[],
  period = 20,
  multiplier = 2,
): BollingerResult {
  const middle = sma(values, period);
  const upper: (number | null)[] = new Array(values.length).fill(null);
  const lower: (number | null)[] = new Array(values.length).fill(null);

  for (let i = period - 1; i < values.length; i++) {
    const mean = middle[i] as number;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      variance += (values[j] - mean) ** 2;
    }
    const sd = Math.sqrt(variance / period);
    upper[i] = mean + multiplier * sd;
    lower[i] = mean - multiplier * sd;
  }

  return { middle, upper, lower };
}

/** Average True Range (Wilder smoothing). */
export function atr(candles: Candle[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(candles.length).fill(null);
  if (candles.length <= period) return out;

  const tr: number[] = [candles[0].high - candles[0].low];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prev = candles[i - 1];
    tr.push(
      Math.max(
        c.high - c.low,
        Math.abs(c.high - prev.close),
        Math.abs(c.low - prev.close),
      ),
    );
  }

  let prev = tr.slice(1, period + 1).reduce((a, b) => a + b, 0) / period;
  out[period] = prev;
  for (let i = period + 1; i < tr.length; i++) {
    prev = (prev * (period - 1) + tr[i]) / period;
    out[i] = prev;
  }
  return out;
}

/** Converts a nullable indicator series into chart-friendly points. */
export function toSeries(
  times: number[],
  values: (number | null)[],
): SeriesPoint[] {
  const out: SeriesPoint[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v != null && Number.isFinite(v)) out.push({ time: times[i], value: v });
  }
  return out;
}

export function percentChange(from: number, to: number) {
  if (!from) return 0;
  return ((to - from) / from) * 100;
}
