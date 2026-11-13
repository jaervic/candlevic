import type { Candle, RawCandle } from "./indicators";
import { toCandles } from "./indicators";

export type DatasetFile = {
  symbol: string;
  interval: string;
  source: string;
  note?: string;
  updatedAt?: string;
  candles: RawCandle[];
};

export type Dataset = {
  id: string;
  symbol: string;
  interval: string;
  source: string;
  note?: string;
  candles: Candle[];
};

type RegistryEntry = {
  label: string;
  symbol: string;
  interval: string;
  kind: "crypto" | "stock";
  load: () => Promise<unknown>;
};

export const DATASETS = {
  "btc-1d": {
    label: "BTC/USDT",
    symbol: "BTCUSDT",
    interval: "1d",
    kind: "crypto",
    load: () => import("../data/btc-1d.json"),
  },
  "eth-1d": {
    label: "ETH/USDT",
    symbol: "ETHUSDT",
    interval: "1d",
    kind: "crypto",
    load: () => import("../data/eth-1d.json"),
  },
  "btc-4h": {
    label: "BTC/USDT 4h",
    symbol: "BTCUSDT",
    interval: "4h",
    kind: "crypto",
    load: () => import("../data/btc-4h.json"),
  },
  "btc-covid": {
    label: "BTC · crash 2020",
    symbol: "BTCUSDT",
    interval: "1d",
    kind: "crypto",
    load: () => import("../data/btc-covid.json"),
  },
  "btc-bear-2022": {
    label: "BTC · bear 2021-22",
    symbol: "BTCUSDT",
    interval: "1d",
    kind: "crypto",
    load: () => import("../data/btc-bear-2022.json"),
  },
  "spy-1d": {
    label: "SPY (S&P 500)",
    symbol: "SPY",
    interval: "1d",
    kind: "stock",
    load: () => import("../data/spy-1d.json"),
  },
  "tsla-1d": {
    label: "TSLA",
    symbol: "TSLA",
    interval: "1d",
    kind: "stock",
    load: () => import("../data/tsla-1d.json"),
  },
  "spy-2008": {
    label: "SPY · crisis 2008",
    symbol: "SPY",
    interval: "1d",
    kind: "stock",
    load: () => import("../data/spy-2008.json"),
  },
  "n225-1990": {
    label: "Nikkei · 1989-2010",
    symbol: "N225",
    interval: "1wk",
    kind: "stock",
    load: () => import("../data/n225-1990.json"),
  },
} satisfies Record<string, RegistryEntry>;

export type DatasetId = keyof typeof DATASETS;

export const DATASET_IDS = Object.keys(DATASETS) as DatasetId[];

export function isDatasetId(value: string): value is DatasetId {
  return value in DATASETS;
}

export async function loadDataset(id: DatasetId): Promise<Dataset> {
  const entry = DATASETS[id];
  const mod = await entry.load();
  const file = ((mod as unknown as { default?: DatasetFile }).default ??
    (mod as unknown)) as DatasetFile;

  return {
    id,
    symbol: file.symbol,
    interval: file.interval,
    source: file.source,
    note: file.note,
    candles: toCandles(file.candles),
  };
}
