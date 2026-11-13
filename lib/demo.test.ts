import { beforeEach, describe, expect, it } from "vitest";
import {
  DEMO_STARTING_CASH,
  demoPnlByStrategy,
  useDemo,
  type DemoTrade,
} from "./demo";

function trade(partial: Partial<DemoTrade>): DemoTrade {
  return {
    id: partial.id ?? "t-1",
    symbol: "BTCUSDT",
    label: "BTC/USD",
    side: "buy",
    qty: 1,
    price: 100,
    fee: 0.1,
    at: 1_700_000_000_000,
    ...partial,
  };
}

describe("demo strategy tags", () => {
  beforeEach(() => {
    useDemo.getState().reset();
  });

  it("hereda la estrategia de la posición al vender", () => {
    const store = useDemo.getState();
    const buy = store.buy({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 100,
      strategy: "cruce-de-medias",
    });
    expect(buy.ok).toBe(true);

    useDemo.getState().sell({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 110,
    });

    const [sell] = useDemo.getState().trades;
    expect(sell.side).toBe("sell");
    expect(sell.strategy).toBe("cruce-de-medias");
  });

  it("etiqueta una posición nueva comprada sin estrategia", () => {
    const store = useDemo.getState();
    store.buy({
      symbol: "ETHUSDT",
      label: "ETH/USD",
      qty: 2,
      price: 50,
    });
    expect(useDemo.getState().positions.ETHUSDT.strategy).toBeUndefined();

    useDemo.getState().sell({
      symbol: "ETHUSDT",
      label: "ETH/USD",
      qty: 2,
      price: 60,
      strategy: "dca",
    });
    const [sell] = useDemo.getState().trades;
    expect(sell.strategy).toBe("dca");
  });

  it("mantiene el efectivo y el P&L al etiquetar", () => {
    const store = useDemo.getState();
    store.buy({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 100,
      strategy: "range",
    });
    useDemo.getState().sell({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 100,
    });
    const state = useDemo.getState();
    expect(state.cash).toBeCloseTo(DEMO_STARTING_CASH - 0.2, 6);
    expect(state.trades[0].realized).toBeCloseTo(-0.2, 6);
  });
});

describe("demoPnlByStrategy", () => {
  it("agrupa operaciones y suma el P&L realizado", () => {
    const groups = demoPnlByStrategy([
      trade({ id: "b1", strategy: "cruce-de-medias" }),
      trade({
        id: "s1",
        side: "sell",
        realized: 25,
        strategy: "cruce-de-medias",
      }),
      trade({
        id: "s2",
        side: "sell",
        realized: -10,
        strategy: "cruce-de-medias",
      }),
      trade({ id: "b2", strategy: "dca" }),
      trade({ id: "b3" }),
    ]);

    expect(groups).toHaveLength(3);
    const [trend, dca, untagged] = groups;
    expect(trend).toMatchObject({
      strategy: "cruce-de-medias",
      trades: 3,
      sells: 2,
      wins: 1,
      realized: 15,
    });
    expect(dca).toMatchObject({ strategy: "dca", trades: 1, sells: 0 });
    expect(untagged).toMatchObject({ strategy: null, trades: 1 });
  });

  it("devuelve una lista vacía sin operaciones", () => {
    expect(demoPnlByStrategy([])).toEqual([]);
  });
});
