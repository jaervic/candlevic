"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatasetId } from "./datasets";

export const DEMO_STARTING_CASH = 10_000;
export const DEMO_FEE_RATE = 0.001;

export type DemoEmotion =
  | "calma"
  | "fomo"
  | "venganza"
  | "duda"
  | "confianza";

export const DEMO_EMOTIONS: { id: DemoEmotion; label: string }[] = [
  { id: "calma", label: "Calma" },
  { id: "confianza", label: "Confianza" },
  { id: "duda", label: "Duda" },
  { id: "fomo", label: "FOMO" },
  { id: "venganza", label: "Venganza" },
];

export type DemoAsset = {
  symbol: string;
  label: string;
  kind: "crypto" | "stock";
  dataset: DatasetId;
};

export const DEMO_ASSETS: DemoAsset[] = [
  { symbol: "BTCUSDT", label: "BTC/USD", kind: "crypto", dataset: "btc-1d" },
  { symbol: "ETHUSDT", label: "ETH/USD", kind: "crypto", dataset: "eth-1d" },
  { symbol: "SPY", label: "SPY", kind: "stock", dataset: "spy-1d" },
  { symbol: "TSLA", label: "TSLA", kind: "stock", dataset: "tsla-1d" },
];

export type DemoTrade = {
  id: string;
  symbol: string;
  label: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  fee: number;
  at: number;
  note?: string;
  emotion?: DemoEmotion;
  realized?: number;
  strategy?: string;
};

export type DemoPosition = {
  symbol: string;
  label: string;
  qty: number;
  avgPrice: number;
  lastPrice: number;
  /** Comisión de compra repartida por unidad, para calcular el P&L neto. */
  feePerUnit?: number;
  strategy?: string;
};

export type DemoEquityPoint = { at: number; value: number };

export type DemoData = {
  cash: number;
  startingCash: number;
  positions: Record<string, DemoPosition>;
  trades: DemoTrade[];
  equity: DemoEquityPoint[];
  createdAt: number;
};

type TradeInput = {
  symbol: string;
  label: string;
  qty: number;
  price: number;
  note?: string;
  emotion?: DemoEmotion;
  strategy?: string;
};

type DemoActions = {
  buy: (input: TradeInput) => { ok: boolean; error?: string };
  sell: (input: TradeInput) => { ok: boolean; error?: string };
  updatePrices: (prices: Record<string, number>) => void;
  reset: () => void;
  importState: (state: unknown) => boolean;
};

export type DemoStore = DemoData & DemoActions;

function initialData(): DemoData {
  return {
    cash: DEMO_STARTING_CASH,
    startingCash: DEMO_STARTING_CASH,
    positions: {},
    trades: [],
    equity: [{ at: Date.now(), value: DEMO_STARTING_CASH }],
    createdAt: Date.now(),
  };
}

export function demoEquity(
  data: Pick<DemoData, "cash" | "positions">,
  prices: Record<string, number> = {},
) {
  const positionsValue = Object.values(data.positions).reduce(
    (sum, position) =>
      sum + position.qty * (prices[position.symbol] ?? position.lastPrice),
    0,
  );
  return data.cash + positionsValue;
}

export function demoMaxDrawdown(points: DemoEquityPoint[]) {
  let peak = 0;
  let max = 0;
  for (const point of points) {
    peak = Math.max(peak, point.value);
    if (peak > 0) max = Math.max(max, (peak - point.value) / peak);
  }
  return max * 100;
}

export function demoWinRate(trades: DemoTrade[]) {
  const sells = trades.filter(
    (trade) => trade.side === "sell" && trade.realized != null,
  );
  if (sells.length === 0) return 0;
  return (
    (sells.filter((trade) => (trade.realized ?? 0) > 0).length /
      sells.length) *
    100
  );
}

export type DemoStrategyPnl = {
  strategy: string | null;
  trades: number;
  sells: number;
  wins: number;
  realized: number;
};

/**
 * Agrupa las operaciones por la etiqueta de estrategia con la que se abrieron.
 * Solo las ventas tienen P&L realizado; las compras cuentan como actividad.
 */
export function demoPnlByStrategy(trades: DemoTrade[]): DemoStrategyPnl[] {
  const groups = new Map<string, DemoStrategyPnl>();
  for (const trade of trades) {
    const key = trade.strategy ?? "";
    let group = groups.get(key);
    if (!group) {
      group = {
        strategy: trade.strategy ?? null,
        trades: 0,
        sells: 0,
        wins: 0,
        realized: 0,
      };
      groups.set(key, group);
    }
    group.trades += 1;
    if (trade.side === "sell" && trade.realized != null) {
      group.sells += 1;
      group.realized += trade.realized;
      if (trade.realized > 0) group.wins += 1;
    }
  }
  return [...groups.values()];
}

export const useDemo = create<DemoStore>()(
  persist(
    (set, get) => ({
      ...initialData(),

      buy: (input) => {
        const state = get();
        const { symbol, label, qty, price, note, emotion, strategy } = input;
        if (!Number.isFinite(qty) || qty <= 0) {
          return { ok: false, error: "La cantidad debe ser mayor que cero." };
        }
        if (!Number.isFinite(price) || price <= 0) {
          return { ok: false, error: "Precio no disponible." };
        }

        const gross = qty * price;
        const fee = gross * DEMO_FEE_RATE;
        if (gross + fee > state.cash + 1e-9) {
          return { ok: false, error: "No tienes suficiente efectivo." };
        }

        const existing = state.positions[symbol];
        const newQty = (existing?.qty ?? 0) + qty;
        const newAvg =
          ((existing?.qty ?? 0) * (existing?.avgPrice ?? 0) + qty * price) /
          newQty;
        const newFeePerUnit =
          ((existing?.qty ?? 0) * (existing?.feePerUnit ?? 0) + fee) / newQty;

        const positions: Record<string, DemoPosition> = {
          ...state.positions,
          [symbol]: {
            symbol,
            label,
            qty: newQty,
            avgPrice: newAvg,
            lastPrice: price,
            feePerUnit: newFeePerUnit,
            strategy: strategy ?? existing?.strategy,
          },
        };

        const trade: DemoTrade = {
          id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          symbol,
          label,
          side: "buy",
          qty,
          price,
          fee,
          at: Date.now(),
          note: note?.trim() || undefined,
          emotion,
          strategy: strategy ?? existing?.strategy,
        };

        const cash = state.cash - gross - fee;
        const value = demoEquity({ cash, positions });
        set({
          cash,
          positions,
          trades: [trade, ...state.trades],
          equity: [...state.equity, { at: trade.at, value }],
        });
        return { ok: true };
      },

      sell: (input) => {
        const state = get();
        const { symbol, label, qty, price, note, emotion, strategy } = input;
        const existing = state.positions[symbol];
        if (!existing) {
          return { ok: false, error: "No tienes posición en este activo." };
        }
        if (!Number.isFinite(qty) || qty <= 0) {
          return { ok: false, error: "La cantidad debe ser mayor que cero." };
        }
        if (qty > existing.qty + 1e-9) {
          return { ok: false, error: "No tienes tantas unidades." };
        }
        if (!Number.isFinite(price) || price <= 0) {
          return { ok: false, error: "Precio no disponible." };
        }

        const gross = qty * price;
        const fee = gross * DEMO_FEE_RATE;
        const proceeds = gross - fee;
        const realized =
          (price - existing.avgPrice) * qty -
          fee -
          (existing.feePerUnit ?? 0) * qty;
        const cash = state.cash + proceeds;

        const positions = { ...state.positions };
        const remaining = existing.qty - qty;
        if (remaining <= 1e-9) {
          delete positions[symbol];
        } else {
          positions[symbol] = { ...existing, qty: remaining, lastPrice: price };
        }

        const trade: DemoTrade = {
          id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          symbol,
          label,
          side: "sell",
          qty,
          price,
          fee,
          at: Date.now(),
          note: note?.trim() || undefined,
          emotion,
          realized,
          strategy: existing.strategy ?? strategy,
        };

        const value = demoEquity({ cash, positions });
        set({
          cash,
          positions,
          trades: [trade, ...state.trades],
          equity: [...state.equity, { at: trade.at, value }],
        });
        return { ok: true };
      },

      updatePrices: (prices) => {
        set((state) => {
          let changed = false;
          const positions = { ...state.positions };
          for (const [symbol, price] of Object.entries(prices)) {
            const position = positions[symbol];
            if (
              position &&
              Number.isFinite(price) &&
              price > 0 &&
              Math.abs(position.lastPrice - price) > 1e-9
            ) {
              positions[symbol] = { ...position, lastPrice: price };
              changed = true;
            }
          }
          return changed ? { positions } : {};
        });
      },

      reset: () => set(initialData()),

      importState: (state) => {
        if (!state || typeof state !== "object") return false;
        const candidate = state as Partial<DemoData>;
        if (
          typeof candidate.cash !== "number" ||
          !candidate.positions ||
          typeof candidate.positions !== "object" ||
          !Array.isArray(candidate.trades)
        ) {
          return false;
        }
        set({
          cash: candidate.cash,
          startingCash: candidate.startingCash ?? DEMO_STARTING_CASH,
          positions: candidate.positions as Record<string, DemoPosition>,
          trades: candidate.trades as DemoTrade[],
          equity: Array.isArray(candidate.equity) ? candidate.equity : [],
          createdAt: candidate.createdAt ?? Date.now(),
        });
        return true;
      },
    }),
    { name: "candlevic:demo:v1", version: 1 },
  ),
);
