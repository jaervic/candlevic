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

describe("demo protection", () => {
  beforeEach(() => {
    useDemo.getState().reset();
  });

  function openPosition() {
    useDemo.getState().buy({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 100,
      strategy: "cruce-de-medias",
    });
  }

  it("valida que el stop esté debajo y el objetivo encima", () => {
    openPosition();
    const store = useDemo.getState();
    expect(store.setProtection("BTCUSDT", 110, null).ok).toBe(false);
    expect(store.setProtection("BTCUSDT", null, 90).ok).toBe(false);
    expect(store.setProtection("BTCUSDT", 95, 110).ok).toBe(true);
    expect(useDemo.getState().positions.BTCUSDT).toMatchObject({
      stop: 95,
      target: 110,
    });
  });

  it("cierra la posición al alcanzar el objetivo", () => {
    openPosition();
    useDemo.getState().setProtection("BTCUSDT", 90, 110);
    useDemo.getState().updatePrices({ BTCUSDT: 111 });

    const state = useDemo.getState();
    expect(state.positions.BTCUSDT).toBeUndefined();
    expect(state.trades[0].side).toBe("sell");
    expect(state.trades[0].price).toBe(110);
    expect(state.trades[0].note).toBe("Objetivo automático");
    expect(state.trades[0].strategy).toBe("cruce-de-medias");
  });

  it("ejecuta el stop con el precio real si hay un hueco a la baja", () => {
    openPosition();
    useDemo.getState().setProtection("BTCUSDT", 90, null);
    useDemo.getState().updatePrices({ BTCUSDT: 80 });

    const state = useDemo.getState();
    expect(state.positions.BTCUSDT).toBeUndefined();
    expect(state.trades[0].price).toBe(80);
    expect(state.trades[0].note).toBe("Stop automático");
    expect(state.trades[0].realized).toBeLessThan(0);
  });

  it("permite quitar la protección", () => {
    openPosition();
    useDemo.getState().setProtection("BTCUSDT", 90, 110);
    expect(useDemo.getState().setProtection("BTCUSDT", null, null).ok).toBe(
      true,
    );
    const position = useDemo.getState().positions.BTCUSDT;
    expect(position.stop).toBeUndefined();
    expect(position.target).toBeUndefined();
  });
});

describe("demo limit orders", () => {
  beforeEach(() => {
    useDemo.getState().reset();
  });

  it("ejecuta una compra límite cuando el precio baja al nivel", () => {
    const placed = useDemo.getState().placeLimit({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      side: "buy",
      qty: 1,
      limit: 90,
      strategy: "rango-soporte-resistencia",
    });
    expect(placed.ok).toBe(true);
    expect(useDemo.getState().orders).toHaveLength(1);

    useDemo.getState().updatePrices({ BTCUSDT: 95 });
    expect(useDemo.getState().orders).toHaveLength(1);

    useDemo.getState().updatePrices({ BTCUSDT: 89 });
    const state = useDemo.getState();
    expect(state.orders).toHaveLength(0);
    expect(state.positions.BTCUSDT.qty).toBe(1);
    expect(state.trades[0].strategy).toBe("rango-soporte-resistencia");
  });

  it("ejecuta una venta límite cuando el precio sube al nivel", () => {
    useDemo.getState().buy({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      qty: 1,
      price: 100,
    });
    const placed = useDemo.getState().placeLimit({
      symbol: "BTCUSDT",
      label: "BTC/USD",
      side: "sell",
      qty: 1,
      limit: 110,
    });
    expect(placed.ok).toBe(true);

    useDemo.getState().updatePrices({ BTCUSDT: 111 });
    const state = useDemo.getState();
    expect(state.orders).toHaveLength(0);
    expect(state.positions.BTCUSDT).toBeUndefined();
    expect(state.trades[0].side).toBe("sell");
    expect(state.trades[0].price).toBe(111);
  });

  it("valida el saldo y permite cancelar", () => {
    const store = useDemo.getState();
    expect(
      store.placeLimit({
        symbol: "BTCUSDT",
        label: "BTC/USD",
        side: "buy",
        qty: 100,
        limit: 1000,
      }).ok,
    ).toBe(false);

    expect(
      store.placeLimit({
        symbol: "BTCUSDT",
        label: "BTC/USD",
        side: "buy",
        qty: 1,
        limit: 90,
      }).ok,
    ).toBe(true);
    const [order] = useDemo.getState().orders;
    useDemo.getState().cancelOrder(order.id);
    expect(useDemo.getState().orders).toHaveLength(0);
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
