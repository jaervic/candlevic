import { sma, type Candle } from "./indicators";

export type StrategyId = "hold" | "sma" | "dca";

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

const NAMES: Record<StrategyId, string> = {
  hold: "Comprar y mantener",
  sma: "Cruce SMA 20/50",
  dca: "DCA 500 $ / mes",
};

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
      name: NAMES[strategy],
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

  let cash = initial;
  let units = 0;
  let trades = 0;
  const equity: BacktestPoint[] = [];

  if (strategy === "hold") {
    units = initial / (candles[0].close * (1 + fee));
    cash = 0;
    trades = 1;
    for (const candle of candles) {
      equity.push({ time: candle.time, value: units * candle.close });
    }
  } else if (strategy === "sma") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      const f = fastSma[i];
      const s = slowSma[i];

      if (f != null && s != null) {
        if (f > s && units === 0 && cash > 0) {
          units = cash / (candle.close * (1 + fee));
          cash = 0;
          trades += 1;
        } else if (f < s && units > 0) {
          cash = units * candle.close * (1 - fee);
          units = 0;
          trades += 1;
        }
      }

      equity.push({ time: candle.time, value: cash + units * candle.close });
    }
  } else {
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
      equity.push({ time: candle.time, value: cash + units * candle.close });
    }
  }

  const finalValue = equity[equity.length - 1]?.value ?? initial;

  return {
    id: strategy,
    name: NAMES[strategy],
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
  return (["hold", "sma", "dca"] as StrategyId[]).map((strategy) =>
    runBacktest(candles, strategy, options),
  );
}
