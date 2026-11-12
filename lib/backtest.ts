import { rsi, sma, type Candle } from "./indicators";

export type StrategyId =
  | "hold"
  | "sma"
  | "donchian"
  | "rsi"
  | "pullback"
  | "range"
  | "dca";

export type BacktestPoint = { time: number; value: number };

export type BacktestResult = {
  id: StrategyId;
  name: string;
  equity: BacktestPoint[];
  finalValue: number;
  returnPct: number;
  maxDrawdown: number;
  trades: number;
};

export type BacktestOptions = {
  fee?: number;
  initial?: number;
  fast?: number;
  slow?: number;
  dcaAmount?: number;
  dcaEvery?: number;
};

export const STRATEGY_NAMES: Record<StrategyId, string> = {
  hold: "Comprar y mantener",
  sma: "Cruce SMA 20/50",
  donchian: "Ruptura Donchian 20/10",
  rsi: "Reversión RSI 30/70",
  pullback: "Pullback a SMA 20",
  range: "Rango 20",
  dca: "DCA 500 $ / mes",
};

export const BACKTEST_STRATEGIES: StrategyId[] = [
  "hold",
  "sma",
  "donchian",
  "rsi",
  "pullback",
  "range",
  "dca",
];

function drawdown(equity: BacktestPoint[]) {
  let peak = 0;
  let max = 0;
  for (const point of equity) {
    peak = Math.max(peak, point.value);
    if (peak > 0) max = Math.max(max, (peak - point.value) / peak);
  }
  return max * 100;
}

export function runBacktest(
  candles: Candle[],
  strategy: StrategyId,
  options: BacktestOptions = {},
): BacktestResult {
  const {
    fee = 0.001,
    initial = 10_000,
    fast = 20,
    slow = 50,
    dcaAmount = 500,
    dcaEvery = 30,
  } = options;

  if (candles.length < 2) {
    return {
      id: strategy,
      name: STRATEGY_NAMES[strategy],
      equity: [],
      finalValue: initial,
      returnPct: 0,
      maxDrawdown: 0,
      trades: 0,
    };
  }

  const closes = candles.map((candle) => candle.close);
  const fastSma = sma(closes, fast);
  const slowSma = sma(closes, slow);
  const rsiValues = rsi(closes, 14);

  let cash = initial;
  let units = 0;
  let trades = 0;
  const equity: BacktestPoint[] = [];

  const buy = (price: number) => {
    if (cash <= 0) return;
    units = cash / (price * (1 + fee));
    cash = 0;
    trades += 1;
  };

  const sell = (price: number) => {
    if (units <= 0) return;
    cash = units * price * (1 - fee);
    units = 0;
    trades += 1;
  };

  if (strategy === "hold") {
    buy(candles[0].close);
    for (const candle of candles) {
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "dca") {
    let nextInvestment = 0;
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      if (i >= nextInvestment && cash > 0) {
        const amount = Math.min(dcaAmount, cash);
        units += amount / (candle.close * (1 + fee));
        cash -= amount;
        trades += 1;
        nextInvestment = i + dcaEvery;
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "sma") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      const f = fastSma[i];
      const s = slowSma[i];
      if (f != null && s != null) {
        if (f > s) buy(candle.close);
        else sell(candle.close);
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "donchian") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      if (i >= 20 && units === 0) {
        const high = Math.max(
          ...candles.slice(i - 20, i).map((item) => item.high),
        );
        if (candle.close > high) buy(candle.close);
      } else if (i >= 10 && units > 0) {
        const low = Math.min(
          ...candles.slice(i - 10, i).map((item) => item.low),
        );
        if (candle.close < low) sell(candle.close);
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "rsi") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      const value = rsiValues[i];
      if (value != null) {
        if (value < 30) buy(candle.close);
        else if (value > 70) sell(candle.close);
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "pullback") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      const f20 = fastSma[i];
      const f50 = slowSma[i];
      const prev20 = fastSma[i - 1];
      if (f20 != null && f50 != null && prev20 != null) {
        if (
          units === 0 &&
          candle.close > f50 &&
          closes[i - 1] < prev20 &&
          candle.close > f20
        ) {
          buy(candle.close);
        } else if (units > 0 && candle.close < f50) {
          sell(candle.close);
        }
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else {
    // range
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      if (i >= 20) {
        const window = candles.slice(i - 20, i);
        const high = Math.max(...window.map((item) => item.high));
        const low = Math.min(...window.map((item) => item.low));
        if (units === 0 && candle.close <= low * 1.01) buy(candle.close);
        else if (units > 0 && candle.close >= high * 0.99) sell(candle.close);
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  }

  const finalValue = equity[equity.length - 1]?.value ?? initial;

  return {
    id: strategy,
    name: STRATEGY_NAMES[strategy],
    equity,
    finalValue,
    returnPct: ((finalValue - initial) / initial) * 100,
    maxDrawdown: drawdown(equity),
    trades,
  };
}

export function runAllBacktests(
  candles: Candle[],
  options: BacktestOptions = {},
): BacktestResult[] {
  return BACKTEST_STRATEGIES.map((strategy) =>
    runBacktest(candles, strategy, options),
  );
}

export function runBacktests(
  candles: Candle[],
  strategies: StrategyId[],
  options: BacktestOptions = {},
): BacktestResult[] {
  return strategies.map((strategy) =>
    runBacktest(candles, strategy, options),
  );
}
