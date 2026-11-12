"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleDot,
  Eraser,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Table2,
  Wifi,
} from "lucide-react";
import { PriceChart, type Overlay } from "@/components/charts/price-chart";
import { Button } from "@/components/ui/button";
import { DATASETS, DATASET_IDS, loadDataset, type Dataset, type DatasetId } from "@/lib/datasets";
import { toCandles, type Candle } from "@/lib/indicators";
import { formatPercent, formatPrice, cn } from "@/lib/utils";
import { ChartDataTable } from "@/components/charts/chart-data-table";

const INDICATORS = [
  { id: "sma20", label: "SMA 20" },
  { id: "sma50", label: "SMA 50" },
  { id: "ema200", label: "EMA 200" },
  { id: "volume", label: "Volumen" },
  { id: "rsi", label: "RSI" },
  { id: "macd", label: "MACD" },
  { id: "bollinger", label: "Bollinger" },
] as const;

type IndicatorId = (typeof INDICATORS)[number]["id"];

export function Lab() {
  const [datasetId, setDatasetId] = useState<DatasetId>("btc-1d");
  const [data, setData] = useState<Dataset | null>(null);
  const [liveCandles, setLiveCandles] = useState<Candle[] | null>(null);
  const [liveInfo, setLiveInfo] = useState<string | null>(null);
  const [liveSymbol, setLiveSymbol] = useState("BTCUSDT");
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [enabled, setEnabled] = useState<Record<IndicatorId, boolean>>({
    sma20: true,
    sma50: true,
    ema200: false,
    volume: true,
    rsi: false,
    macd: false,
    bollinger: false,
  });

  const [replay, setReplay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState<number | null>(null);
  const [speed, setSpeed] = useState(2);
  const [liveInterval, setLiveInterval] = useState<"1h" | "4h" | "1d">("1h");

  const [drawMode, setDrawMode] = useState(false);
  const [lines, setLines] = useState<number[]>([]);
  const [showData, setShowData] = useState(false);

  const entry = DATASETS[datasetId];
  const isCrypto = entry.kind === "crypto";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLiveCandles(null);
    setLiveInfo(null);
    setLiveError(null);
    setLines([]);
    setReplay(false);
    setVisible(null);

    loadDataset(datasetId).then((result) => {
      if (!active) return;
      setData(result);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [datasetId]);

  const candles = useMemo(
    () => liveCandles ?? data?.candles ?? [],
    [liveCandles, data],
  );

  useEffect(() => {
    if (!replay || !playing || visible == null) return;
    if (visible >= candles.length) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisible((value) =>
        value == null ? null : Math.min(value + 1, candles.length),
      );
    }, 800 / speed);
    return () => clearTimeout(timer);
  }, [replay, playing, visible, speed, candles.length]);

  async function loadLive(interval: "1h" | "4h" | "1d") {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const res = await fetch(
        `/api/klines?symbol=BTCUSDT&interval=${interval}&limit=400`,
      );
      if (!res.ok) throw new Error("bad response");
      const json = (await res.json()) as {
        candles: Parameters<typeof toCandles>[0];
        source?: string;
        sourceSymbol?: string;
      };
      setLiveCandles(toCandles(json.candles));
      setLiveSymbol(json.sourceSymbol ?? "BTCUSDT");
      setLiveInfo(
        `${json.sourceSymbol ?? "BTCUSDT"} · ${interval} · ${json.source ?? "En vivo"}`,
      );
      setLiveInterval(interval);
      setReplay(false);
      setPlaying(false);
      setVisible(null);
      setLines([]);
    } catch {
      setLiveError(
        "No se pudo conectar con los datos en vivo. Se mantienen los datos incluidos.",
      );
    } finally {
      setLiveLoading(false);
    }
  }

  function toggle(id: IndicatorId) {
    setEnabled((prev) => {
      if (id === "rsi") return { ...prev, rsi: !prev.rsi, macd: false };
      if (id === "macd") return { ...prev, macd: !prev.macd, rsi: false };
      return { ...prev, [id]: !prev[id] };
    });
  }

  const overlays = useMemo(() => {
    const list: Overlay[] = [];
    if (enabled.sma20) list.push({ type: "sma", period: 20, color: "#f0b429" });
    if (enabled.sma50) list.push({ type: "sma", period: 50, color: "#5aa9ff" });
    if (enabled.ema200) list.push({ type: "ema", period: 200, color: "#a78bfa" });
    return list;
  }, [enabled.sma20, enabled.sma50, enabled.ema200]);

  const displayed =
    replay && visible != null ? candles.slice(0, visible) : candles;
  const last = displayed[displayed.length - 1];
  const previous = displayed[displayed.length - 2];
  const change =
    last && previous ? ((last.close - previous.close) / previous.close) * 100 : 0;

  function startReplay() {
    if (candles.length === 0) return;
    setReplay(true);
    setPlaying(true);
    setVisible(Math.max(40, Math.floor(candles.length * 0.55)));
    setLines([]);
  }

  function handlePick(index: number) {
    if (!drawMode) return;
    const price = candles[index]?.close;
    if (price) setLines((prev) => [...prev.slice(-5), price]);
  }

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Práctica
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Laboratorio</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Arrastra, pellizca y activa indicadores. Sin dinero real y sin
          consecuencias.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-line bg-surface p-3">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-faint">
            Activo
          </p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
            {DATASET_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setDatasetId(id)}
                className={cn(
                  "shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                  id === datasetId && !liveCandles
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line bg-surface-2/60 text-muted hover:text-fg",
                )}
              >
                {DATASETS[id].label}
              </button>
            ))}
          </div>
        </div>

        {isCrypto && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-faint">
              <Wifi className="h-3 w-3" /> Datos en vivo (BTC)
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["1h", "4h", "1d"] as const).map((interval) => (
                <button
                  key={interval}
                  onClick={() => loadLive(interval)}
                  disabled={liveLoading}
                  className="rounded-lg border border-line bg-surface-2/60 px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:text-fg disabled:opacity-50"
                >
                  {liveLoading ? "…" : `${interval} en vivo`}
                </button>
              ))}
              {liveCandles && (
                <button
                  onClick={() => {
                    setLiveCandles(null);
                    setLiveInfo(null);
                  }}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-faint hover:text-fg"
                >
                  Volver al dataset
                </button>
              )}
            </div>
            {liveError && (
              <p className="mt-1.5 text-[10.5px] text-down">{liveError}</p>
            )}
          </div>
        )}

        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-faint">
            Indicadores
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INDICATORS.map((indicator) => (
              <button
                key={indicator.id}
                onClick={() => toggle(indicator.id)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                  enabled[indicator.id]
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line bg-surface-2/60 text-muted hover:text-fg",
                )}
                aria-pressed={enabled[indicator.id]}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line/70 pt-3">
          {!replay ? (
            <Button size="sm" variant="secondary" onClick={startReplay}>
              <Play className="h-3.5 w-3.5" /> Replay de velas
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {playing ? "Pausar" : "Seguir"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplay(false);
                  setPlaying(false);
                  setVisible(null);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Salir
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 4].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSpeed(value)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[10px]",
                      speed === value
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-line text-faint hover:text-fg",
                    )}
                  >
                    {value}x
                  </button>
                ))}
              </div>
              <span className="num text-[10px] text-faint">
                {visible ?? 0}/{candles.length}
              </span>
            </>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowData((value) => !value)}
              aria-pressed={showData}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                showData
                  ? "border-info/30 bg-info/10 text-info"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              <Table2 className="h-3.5 w-3.5" /> Datos
            </button>
            <button
              onClick={() => setDrawMode((d) => !d)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                drawMode
                  ? "border-info/30 bg-info/10 text-info"
                  : "border-line text-muted hover:text-fg",
              )}
              aria-pressed={drawMode}
            >
              <CircleDot className="h-3.5 w-3.5" /> Línea
            </button>
            {lines.length > 0 && (
              <button
                onClick={() => setLines([])}
                className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1.5 text-[11px] text-faint hover:text-fg"
              >
                <Eraser className="h-3.5 w-3.5" /> Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-medium">
              {liveInfo ?? `${entry.label} · ${entry.interval}`}
            </span>
            {last && (
              <>
                <span className="num text-[13px] font-semibold">
                  {formatPrice(last.close)}
                </span>
                <span
                  className={cn(
                    "num text-[11px]",
                    change >= 0 ? "text-up" : "text-down",
                  )}
                >
                  {formatPercent(change)}
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-faint">
            {drawMode ? "Toca el gráfico para dibujar una línea" : "Arrastra y pellizca"}
          </span>
        </div>

        {loading && !data ? (
          <div className="flex h-[360px] items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-faint" />
          </div>
        ) : (
          <PriceChart
            candles={candles}
            symbol={liveInfo ? liveSymbol : data?.symbol}
            interval={liveInfo ? liveInterval : data?.interval}
            height={360}
            overlays={overlays}
            showVolume={enabled.volume}
            showRsi={enabled.rsi}
            showBollinger={enabled.bollinger}
            showMacd={enabled.macd}
            visibleCount={replay && visible != null ? visible : undefined}
            priceLines={lines}
            onPick={handlePick}
          />
        )}
        {showData && (
          <ChartDataTable
            candles={displayed}
            interval={liveInfo ? liveInterval : data?.interval}
          />
        )}
      </section>

      <div className="rounded-xl border border-line bg-surface p-3.5 text-[11.5px] leading-relaxed text-muted">
        <span className="font-medium text-fg">Cómo practicar: </span>
        activa el replay y decide si comprarías o venderías antes de ver la
        siguiente vela. Anota la decisión, el stop y el objetivo. Al terminar,
        compara el resultado con tu plan, no con la suerte.
      </div>
    </div>
  );
}
