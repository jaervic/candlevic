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
  /** Deslizamiento por operación, en tanto por uno (0,0005 = 0,05 %). */
  slippage?: number;
  fast?: number;
  slow?: number;
  dcaAmount?: number;
  dcaEvery?: number;
  rsiBuy?: number;
  rsiSell?: number;
  donchianEntry?: number;
  donchianExit?: number;
  rangeWindow?: number;
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
    slippage = 0,
    fast = 20,
    slow = 50,
    dcaAmount = 500,
    dcaEvery = 30,
    rsiBuy = 30,
    rsiSell = 70,
    donchianEntry = 20,
    donchianExit = 10,
    rangeWindow = 20,
  } = options;

  const name = resultName(strategy, {
    fast,
    slow,
    dcaAmount,
    dcaEvery,
    rsiBuy,
    rsiSell,
    donchianEntry,
    donchianExit,
    rangeWindow,
  });

  if (candles.length < 2) {
    return {
      id: strategy,
      name,
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
    const fill = price * (1 + slippage);
    units = cash / (fill * (1 + fee));
    cash = 0;
    trades += 1;
  };

  const sell = (price: number) => {
    if (units <= 0) return;
    const fill = price * (1 - slippage);
    cash = units * fill * (1 - fee);
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
        units += amount / (candle.close * (1 + slippage) * (1 + fee));
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
      if (i >= donchianEntry && units === 0) {
        const high = Math.max(
          ...candles
            .slice(i - donchianEntry, i)
            .map((item) => item.high),
        );
        if (candle.close > high) buy(candle.close);
      } else if (i >= donchianExit && units > 0) {
        const low = Math.min(
          ...candles.slice(i - donchianExit, i).map((item) => item.low),
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
        if (value < rsiBuy) buy(candle.close);
        else if (value > rsiSell) sell(candle.close);
      }
      equity.push({
        time: candle.time,
        value: cash + units * candle.close,
      });
    }
  } else if (strategy === "pullback") {
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      const fastValue = fastSma[i];
      const slowValue = slowSma[i];
      const previousFast = fastSma[i - 1];
      if (fastValue != null && slowValue != null && previousFast != null) {
        if (
          units === 0 &&
          candle.close > slowValue &&
          closes[i - 1] < previousFast &&
          candle.close > fastValue
        ) {
          buy(candle.close);
        } else if (units > 0 && candle.close < slowValue) {
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
      if (i >= rangeWindow) {
        const window = candles.slice(i - rangeWindow, i);
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
    name,
    equity,
    finalValue,
    returnPct: ((finalValue - initial) / initial) * 100,
    maxDrawdown: drawdown(equity),
    trades,
  };
}

function resultName(
  strategy: StrategyId,
  params: {
    fast: number;
    slow: number;
    dcaAmount: number;
    dcaEvery: number;
    rsiBuy: number;
    rsiSell: number;
    donchianEntry: number;
    donchianExit: number;
    rangeWindow: number;
  },
) {
  switch (strategy) {
    case "sma":
      return `Cruce SMA ${params.fast}/${params.slow}`;
    case "pullback":
      return `Pullback SMA ${params.fast}/${params.slow}`;
    case "donchian":
      return `Donchian ${params.donchianEntry}/${params.donchianExit}`;
    case "rsi":
      return `RSI ${params.rsiBuy}/${params.rsiSell}`;
    case "range":
      return `Rango ${params.rangeWindow}`;
    case "dca":
      return `DCA ${params.dcaAmount} $ / ${params.dcaEvery} velas`;
    default:
      return STRATEGY_NAMES[strategy];
  }
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
