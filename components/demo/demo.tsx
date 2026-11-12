"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  Loader2,
  RefreshCw,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { PriceChart } from "@/components/charts/price-chart";
import { EquitySparkline } from "@/components/demo/equity-sparkline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadDataset } from "@/lib/datasets";
import { track } from "@/lib/analytics";
import { toCandles, type Candle } from "@/lib/indicators";
import {
  DEMO_ASSETS,
  DEMO_EMOTIONS,
  DEMO_FEE_RATE,
  demoEquity,
  demoMaxDrawdown,
  demoWinRate,
  useDemo,
  type DemoAsset,
  type DemoEmotion,
} from "@/lib/demo";
import {
  cn,
  formatNumber,
  formatPercent,
  formatPrice,
  relativeTime,
} from "@/lib/utils";

type MarketEntry = {
  candles: Candle[];
  source: string;
  interval: string;
};

type Status = { type: "ok" | "err"; message: string } | null;

export function Demo() {
  const [market, setMarket] = useState<Record<string, MarketEntry>>({});
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState<DemoAsset>(DEMO_ASSETS[0]);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [emotion, setEmotion] = useState<DemoEmotion>("calma");
  const [status, setStatus] = useState<Status>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const data = useDemo();
  const updatePrices = useDemo((state) => state.updatePrices);

  async function loadMarket() {
    setLoading(true);
    const results = await Promise.allSettled(
      DEMO_ASSETS.map(async (item) => {
        if (item.kind === "crypto") {
          try {
            const res = await fetch(
              `/api/klines?symbol=${item.symbol}&interval=1h&limit=300`,
            );
            if (!res.ok) throw new Error("bad response");
            const json = (await res.json()) as {
              candles: Parameters<typeof toCandles>[0];
              source?: string;
              interval?: string;
            };
            return {
              symbol: item.symbol,
              entry: {
                candles: toCandles(json.candles),
                source: json.source ?? "En vivo",
                interval: json.interval ?? "1h",
              } satisfies MarketEntry,
            };
          } catch {
            const fallback = await loadDataset(item.dataset);
            return {
              symbol: item.symbol,
              entry: {
                candles: fallback.candles,
                source: "Datos incluidos",
                interval: fallback.interval,
              } satisfies MarketEntry,
            };
          }
        }

        const fallback = await loadDataset(item.dataset);
        return {
          symbol: item.symbol,
          entry: {
            candles: fallback.candles,
            source: "Datos incluidos",
            interval: fallback.interval,
          } satisfies MarketEntry,
        };
      }),
    );

    const next: Record<string, MarketEntry> = {};
    for (const result of results) {
      if (result.status === "fulfilled") {
        next[result.value.symbol] = result.value.entry;
      }
    }
    setMarket(next);
    setLoading(false);
  }

  useEffect(() => {
    void loadMarket();
    const timer = window.setInterval(() => void loadMarket(), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const prices = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(market).map(([symbol, entry]) => [
          symbol,
          entry.candles[entry.candles.length - 1]?.close ?? 0,
        ]),
      ),
    [market],
  );

  useEffect(() => {
    updatePrices(prices);
  }, [prices, updatePrices]);

  const entry = market[asset.symbol];
  const candles = entry?.candles ?? [];
  const price = candles[candles.length - 1]?.close ?? 0;
  const previous = candles[candles.length - 2]?.close ?? price;
  const change = previous > 0 ? ((price - previous) / previous) * 100 : 0;
  const position = data.positions[asset.symbol];
  const equity = demoEquity(data, prices);
  const pnl = equity - data.startingCash;
  const returnPct =
    data.startingCash > 0 ? (pnl / data.startingCash) * 100 : 0;
  const equityPoints = useMemo(
    () => [...data.equity, { at: Date.now(), value: equity }],
    [data.equity, equity],
  );
  const maxDrawdown = demoMaxDrawdown(equityPoints);
  const winRate = demoWinRate(data.trades);
  const positionsValue = equity - data.cash;
  const exposure = equity > 0 ? (positionsValue / equity) * 100 : 0;

  const maxQty =
    side === "buy"
      ? price > 0
        ? data.cash / (price * (1 + DEMO_FEE_RATE))
        : 0
      : (position?.qty ?? 0);

  const qtyNumber = Number(qty.replace(",", "."));
  const validQty = Number.isFinite(qtyNumber) && qtyNumber > 0;
  const gross = validQty ? qtyNumber * price : 0;
  const fee = gross * DEMO_FEE_RATE;
  const total = side === "buy" ? gross + fee : gross - fee;

  function execute() {
    if (!validQty || price <= 0) {
      setStatus({ type: "err", message: "Introduce una cantidad válida." });
      return;
    }
    const input = {
      symbol: asset.symbol,
      label: asset.label,
      qty: qtyNumber,
      price,
      note,
      emotion,
    };
    const result = side === "buy" ? data.buy(input) : data.sell(input);
    if (result.ok) {
      track("demo_trade", { side, symbol: asset.symbol });
      setStatus({
        type: "ok",
        message:
          side === "buy"
            ? `Compra simulada: ${formatNumber(qtyNumber, 4)} ${asset.label}.`
            : `Venta simulada: ${formatNumber(qtyNumber, 4)} ${asset.label}.`,
      });
      setQty("");
      setNote("");
    } else {
      setStatus({ type: "err", message: result.error ?? "No se pudo ejecutar." });
    }
  }

  function quick(percent: number) {
    setQty((maxQty * percent).toFixed(6));
  }

  function exportDemo() {
    const payload = {
      app: "candlevic-demo",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        cash: data.cash,
        startingCash: data.startingCash,
        positions: data.positions,
        trades: data.trades,
        equity: data.equity,
        createdAt: data.createdAt,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candlevic-demo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importDemo(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as {
        app?: string;
        data?: unknown;
      };
      if (parsed.app !== "candlevic-demo") throw new Error("formato");
      const ok = data.importState(parsed.data);
      setStatus(
        ok
          ? { type: "ok", message: "Cartera demo importada." }
          : { type: "err", message: "El archivo no tiene un formato válido." },
      );
    } catch {
      setStatus({ type: "err", message: "No se pudo leer el archivo." });
    }
  }

  const positions = Object.values(data.positions);

  return (
    <div className="space-y-5">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
            Práctica
          </p>
          <Badge tone="accent">Dinero virtual</Badge>
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Trading demo
        </h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Compra y vende con 10.000 $ virtuales. Sin órdenes reales, sin
          registro y sin riesgo. El objetivo es practicar el proceso.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Equity" value={`$${formatNumber(equity, 2)}`} />
        <Stat label="Efectivo" value={`$${formatNumber(data.cash, 2)}`} />
        <Stat
          label="P&L"
          value={`${pnl >= 0 ? "+" : "−"}$${formatNumber(Math.abs(pnl), 2)}`}
          tone={pnl >= 0 ? "up" : "down"}
        />
        <Stat
          label="Rentabilidad"
          value={formatPercent(returnPct)}
          tone={returnPct >= 0 ? "up" : "down"}
        />
      </section>

      <a
        href="#order-ticket"
        className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[12px] font-medium text-on-accent shadow-lg lg:hidden"
      >
        <Wallet className="h-4 w-4" /> Operar
      </a>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="space-y-3 border-b border-line p-3">
              <div className="flex flex-wrap gap-1.5">
                {DEMO_ASSETS.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => setAsset(item)}
                    aria-pressed={item.symbol === asset.symbol}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                      item.symbol === asset.symbol
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-line bg-surface-2/60 text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => void loadMarket()}
                  disabled={loading}
                  className="ml-auto inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1.5 text-[10px] text-faint hover:text-fg disabled:opacity-50"
                >
                  <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                  {loading ? "Cargando" : "Actualizar"}
                </button>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-medium">{asset.label}</span>
                  <span className="num text-[16px] font-semibold">
                    {formatPrice(price)}
                  </span>
                  <span
                    className={cn(
                      "num text-[11px]",
                      change >= 0 ? "text-up" : "text-down",
                    )}
                  >
                    {formatPercent(change)}
                  </span>
                </div>
                <span className="text-[10px] text-faint">
                  {entry?.interval ?? "1h"} · {entry?.source ?? "—"}
                </span>
              </div>
            </div>

            {candles.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-faint" />
              </div>
            ) : (
              <PriceChart
                candles={candles}
                symbol={asset.label}
                interval={entry?.interval}
                height={300}
                overlays={[{ type: "sma", period: 50 }]}
                showVolume
              />
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold">Cartera</h2>
              </div>
              <span className="text-[10px] text-faint">
                Exposición {formatPercent(exposure)}
              </span>
            </div>

            {positions.length === 0 ? (
              <p className="mt-3 text-[12px] text-muted">
                Aún no tienes posiciones. Usa el ticket de la derecha para
                abrir la primera operación simulada.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-faint">
                      <th className="py-1 pr-2 font-medium">Activo</th>
                      <th className="px-2 py-1 text-right font-medium">
                        Cantidad
                      </th>
                      <th className="px-2 py-1 text-right font-medium">
                        Precio medio
                      </th>
                      <th className="px-2 py-1 text-right font-medium">
                        Actual
                      </th>
                      <th className="px-2 py-1 text-right font-medium">
                        Valor
                      </th>
                      <th className="px-2 py-1 text-right font-medium">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((item) => {
                      const current = prices[item.symbol] ?? item.lastPrice;
                      const value = item.qty * current;
                      const pnlPosition = (current - item.avgPrice) * item.qty;
                      return (
                        <tr key={item.symbol} className="border-t border-line/60">
                          <td className="py-1.5 pr-2 font-medium">
                            {item.label}
                          </td>
                          <td className="num px-2 py-1.5 text-right text-muted">
                            {formatNumber(item.qty, 4)}
                          </td>
                          <td className="num px-2 py-1.5 text-right text-muted">
                            {formatPrice(item.avgPrice)}
                          </td>
                          <td className="num px-2 py-1.5 text-right">
                            {formatPrice(current)}
                          </td>
                          <td className="num px-2 py-1.5 text-right">
                            ${formatNumber(value, 2)}
                          </td>
                          <td
                            className={cn(
                              "num px-2 py-1.5 text-right",
                              pnlPosition >= 0 ? "text-up" : "text-down",
                            )}
                          >
                            {pnlPosition >= 0 ? "+" : "−"}$
                            {formatNumber(Math.abs(pnlPosition), 2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold">Historial</h2>
            {data.trades.length === 0 ? (
              <p className="mt-2 text-[12px] text-muted">
                Cada operación quedará registrada aquí con tu nota y tu emoción.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {data.trades.slice(0, 12).map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-xl border border-line bg-surface-2/40 p-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                          trade.side === "buy"
                            ? "bg-up/10 text-up"
                            : "bg-down/10 text-down",
                        )}
                      >
                        {trade.side === "buy" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {trade.side === "buy" ? "Compra" : "Venta"}
                      </span>
                      <span className="text-[11.5px] font-medium">
                        {trade.label}
                      </span>
                      <span className="num text-[10px] text-muted">
                        {formatNumber(trade.qty, 4)} × {formatPrice(trade.price)}
                      </span>
                      {trade.realized != null && (
                        <span
                          className={cn(
                            "num ml-auto text-[10px]",
                            trade.realized >= 0 ? "text-up" : "text-down",
                          )}
                        >
                          {trade.realized >= 0 ? "+" : "−"}$
                          {formatNumber(Math.abs(trade.realized), 2)}
                        </span>
                      )}
                      <span className="text-[9px] text-faint">
                        {relativeTime(trade.at)}
                      </span>
                    </div>
                    {(trade.note || trade.emotion) && (
                      <p className="mt-1 text-[10px] text-faint">
                        {trade.emotion && (
                          <span className="text-muted">
                            {DEMO_EMOTIONS.find((e) => e.id === trade.emotion)
                              ?.label ?? trade.emotion}
                          </span>
                        )}
                        {trade.emotion && trade.note ? " · " : ""}
                        {trade.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <section
            id="order-ticket"
            className="scroll-mt-20 rounded-2xl border border-line bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Nueva operación</h2>
              <span className="text-[10px] text-faint">
                Comisión {(DEMO_FEE_RATE * 100).toFixed(1)}%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl border border-line bg-surface-2/50 p-1">
              {(["buy", "sell"] as const).map((value) => (
                <button
                  key={value}
                  aria-pressed={side === value}
                  onClick={() => {
                    setSide(value);
                    setQty("");
                    setStatus(null);
                  }}
                  className={cn(
                    "rounded-lg py-2 text-[12px] font-medium transition-colors",
                    side === value
                      ? value === "buy"
                        ? "bg-up/15 text-up"
                        : "bg-down/15 text-down"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {value === "buy" ? "Comprar" : "Vender"}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
                  Cantidad ({asset.label})
                </span>
                <input
                  inputMode="decimal"
                  value={qty}
                  onChange={(event) => setQty(event.target.value)}
                  placeholder="0,00"
                  className="num h-10 w-full rounded-lg border border-line bg-surface-2 px-2 text-[14px] text-fg outline-none focus:border-accent/40"
                />
              </label>
              <div className="flex gap-1.5">
                {[0.25, 0.5, 1].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => quick(percent)}
                    className="flex-1 rounded-lg border border-line bg-surface-2/60 py-1.5 text-[10px] text-muted hover:text-fg"
                  >
                    {percent === 1 ? "Máx" : `${percent * 100}%`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-faint">
                Disponible: {formatNumber(maxQty, 4)} {asset.label}
              </p>

              <div className="rounded-xl border border-line bg-surface-2/40 p-2.5 text-[11px]">
                <div className="flex justify-between text-muted">
                  <span>Precio</span>
                  <span className="num text-fg">{formatPrice(price)}</span>
                </div>
                <div className="mt-1 flex justify-between text-muted">
                  <span>Importe</span>
                  <span className="num text-fg">
                    ${formatNumber(gross, 2)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-muted">
                  <span>Comisión</span>
                  <span className="num text-fg">${formatNumber(fee, 2)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-line/70 pt-1 font-medium">
                  <span>{side === "buy" ? "Coste total" : "Recibes"}</span>
                  <span className="num text-fg">
                    ${formatNumber(Math.abs(total), 2)}
                  </span>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
                  Emoción
                </span>
                <select
                  value={emotion}
                  onChange={(event) =>
                    setEmotion(event.target.value as DemoEmotion)
                  }
                  className="h-9 w-full rounded-lg border border-line bg-surface-2 px-2 text-[12px] text-fg outline-none focus:border-accent/40"
                >
                  {DEMO_EMOTIONS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-faint">
                  Nota (opcional)
                </span>
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="¿Por qué entras?"
                  className="h-9 w-full rounded-lg border border-line bg-surface-2 px-2 text-[12px] text-fg outline-none focus:border-accent/40"
                />
              </label>

              <Button
                className="w-full"
                onClick={execute}
                disabled={!validQty || price <= 0}
              >
                {side === "buy" ? "Comprar" : "Vender"} {asset.label}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {status && (
                <p
                  className={cn(
                    "flex items-start gap-1.5 rounded-lg border p-2 text-[10.5px] leading-relaxed",
                    status.type === "ok"
                      ? "border-up/25 bg-up/10 text-fg/90"
                      : "border-down/25 bg-down/10 text-fg/90",
                  )}
                >
                  {status.type === "ok" ? (
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-up" />
                  ) : (
                    <X className="mt-0.5 h-3 w-3 shrink-0 text-down" />
                  )}
                  {status.message}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold">Tu curva</h2>
            <div className="mt-2">
              <EquitySparkline points={equityPoints} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Mini label="Drawdown" value={`${formatNumber(maxDrawdown, 1)}%`} />
              <Mini
                label="Acierto"
                value={`${formatNumber(winRate, 0)}%`}
              />
              <Mini label="Operaciones" value={String(data.trades.length)} />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold">Cartera demo</h2>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              Se guarda en este dispositivo. El código de guardado del progreso
              no incluye la cartera; usa exportar/importar.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={exportDemo}>
                <Download className="h-3.5 w-3.5" /> Exportar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" /> Importar
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importDemo(file);
                  event.target.value = "";
                }}
              />
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Reiniciar la cartera demo a 10.000 $? Se borrarán las operaciones.",
                    )
                  ) {
                    data.reset();
                    setStatus({
                      type: "ok",
                      message: "Cartera demo reiniciada.",
                    });
                  }
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
              </Button>
            </div>
          </section>

          <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/5 p-3 text-[10px] leading-relaxed text-muted">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>
              Dinero virtual. No se envían órdenes reales. Los precios de cripto
              pueden tener retraso y los de acciones son datos históricos
              incluidos. La ejecución es una simulación al último cierre.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[9px] uppercase tracking-wider text-faint">{label}</p>
      <p
        className={cn(
          "num mt-0.5 text-[15px] font-semibold",
          tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2/50 px-2 py-1.5">
      <p className="text-[8px] uppercase tracking-wider text-faint">{label}</p>
      <p className="num mt-0.5 text-[11px] font-medium">{value}</p>
    </div>
  );
}
