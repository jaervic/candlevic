"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
  createSeriesMarkers,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import type { Candle } from "@/lib/indicators";
import { ema, rsi, sma, toSeries } from "@/lib/indicators";
import { cn, formatPrice } from "@/lib/utils";
import { CHART_PALETTES, chartColor } from "@/lib/chart-theme";
import { useResolvedTheme } from "@/components/theme/theme-context";

export type Overlay = {
  type: "sma" | "ema";
  period: number;
  color?: string;
};

export type ChartMarker = {
  index: number;
  text: string;
  color?: string;
  position?: "aboveBar" | "belowBar" | "inBar";
  shape?: "arrowUp" | "arrowDown" | "circle" | "square";
};

type PriceChartProps = {
  candles: Candle[];
  symbol?: string;
  interval?: string;
  height?: number;
  overlays?: Overlay[];
  showVolume?: boolean;
  showRsi?: boolean;
  markers?: ChartMarker[];
  priceLines?: number[];
  visibleCount?: number;
  onPick?: (index: number) => void;
  className?: string;
};

function precisionFor(price: number) {
  if (price >= 1000) return 0;
  if (price >= 1) return 2;
  return 4;
}

export function PriceChart({
  candles,
  symbol,
  interval = "1d",
  height = 260,
  overlays = [],
  showVolume = false,
  showRsi = false,
  markers = [],
  priceLines = [],
  visibleCount,
  onPick,
  className,
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const overlayRefs = useRef<ISeriesApi<"Line">[]>([]);
  const rsiRef = useRef<ISeriesApi<"Line"> | null>(null);
  const markersApiRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const resolvedTheme = useResolvedTheme();
  const palette = CHART_PALETTES[resolvedTheme];

  const overlaysKey = JSON.stringify(overlays);

  // Crea (o recrea) el gráfico cuando cambia su estructura.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || candles.length === 0) return;

    const price = candles[candles.length - 1]?.close ?? 1;
    const precision = precisionFor(price);

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: palette.text,
        fontSize: 10,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.08,
          bottom: showRsi ? 0.32 : showVolume ? 0.22 : 0.06,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: interval !== "1d" && interval !== "1w",
        secondsVisible: false,
        rightOffset: 3,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: palette.crosshair, width: 1, labelBackgroundColor: palette.crosshair },
        horzLine: { color: palette.crosshair, width: 1, labelBackgroundColor: palette.crosshair },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: palette.up,
      downColor: palette.down,
      borderVisible: false,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
      priceFormat: { type: "price", precision, minMove: 10 ** -precision },
    });

    chartRef.current = chart;
    candleRef.current = candleSeries;
    markersApiRef.current = createSeriesMarkers(candleSeries, []);

    if (showVolume) {
      const volume = chart.addSeries(HistogramSeries, {
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
        lastValueVisible: false,
        priceLineVisible: false,
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: showRsi ? 0.84 : 0.8, bottom: 0 },
        borderVisible: false,
      });
      volumeRef.current = volume;
    }

    if (showRsi) {
      const rsiSeries = chart.addSeries(LineSeries, {
        color: palette.rsi,
        lineWidth: 1,
        priceScaleId: "rsi",
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      });
      chart.priceScale("rsi").applyOptions({
        scaleMargins: { top: showVolume ? 0.56 : 0.74, bottom: showVolume ? 0.24 : 0.02 },
        borderVisible: false,
      });
      rsiSeries.createPriceLine({
        price: 70,
        color: palette.rsiHigh,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
      });
      rsiSeries.createPriceLine({
        price: 30,
        color: palette.rsiLow,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
      });
      rsiRef.current = rsiSeries;
    }

    const overlayPalette = [
      palette.accent,
      palette.info,
      palette.up,
      palette.down,
    ];

    overlayRefs.current = overlays.map((overlay, i) =>
      chart.addSeries(LineSeries, {
        color: chartColor(
          overlay.color,
          resolvedTheme,
          overlayPalette[i % overlayPalette.length],
        ),
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      }),
    );

    const indexByTime = new Map<number, number>();
    candles.forEach((c, i) => indexByTime.set(c.time, i));

    chart.subscribeClick((param) => {
      if (!param.time || !onPickRef.current) return;
      const index = indexByTime.get(param.time as number);
      if (index != null) onPickRef.current(index);
    });

    chart.subscribeCrosshairMove((param) => {
      const legend = legendRef.current;
      if (!legend) return;
      const data = param.seriesData.get(candleSeries) as
        | CandlestickData<UTCTimestamp>
        | undefined;
      if (!data) {
        legend.textContent = `${symbol ?? ""} ${interval}`.trim();
        return;
      }
      legend.textContent = [
        symbol ?? "",
        interval,
        `C ${formatPrice(data.close)}`,
        `A ${formatPrice(data.open)}`,
        `M ${formatPrice(data.high)}`,
        `m ${formatPrice(data.low)}`,
      ]
        .filter(Boolean)
        .join("  ");
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      overlayRefs.current = [];
      rsiRef.current = null;
      markersApiRef.current = null;
      priceLinesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlaysKey, showVolume, showRsi, interval, symbol, height, resolvedTheme]);

  // Actualiza los datos (incluido el replay).
  useEffect(() => {
    const chart = chartRef.current;
    const series = candleRef.current;
    if (!chart || !series) return;

    const slice = visibleCount
      ? candles.slice(0, Math.max(2, visibleCount))
      : candles;

    const times = slice.map((c) => c.time as UTCTimestamp);
    const closes = slice.map((c) => c.close);

    series.setData(
      slice.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );

    if (volumeRef.current) {
      volumeRef.current.setData(
        slice.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.volume,
          color:
            c.close >= c.open
              ? palette.volumeUp
              : palette.volumeDown,
        })),
      );
    }

    if (rsiRef.current) {
      rsiRef.current.setData(toSeries(times, rsi(closes, 14)) as { time: UTCTimestamp; value: number }[]);
    }

    overlays.forEach((overlay, i) => {
      const target = overlayRefs.current[i];
      if (!target) return;
      const values =
        overlay.type === "sma"
          ? sma(closes, overlay.period)
          : ema(closes, overlay.period);
      target.setData(toSeries(times, values) as { time: UTCTimestamp; value: number }[]);
    });

    chart.timeScale().fitContent();

    if (legendRef.current && slice.length > 0) {
      const lastCandle = slice[slice.length - 1];
      legendRef.current.textContent = [
        symbol ?? "",
        interval,
        `C ${formatPrice(lastCandle.close)}`,
      ]
        .filter(Boolean)
        .join("   ");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, visibleCount, overlaysKey, showVolume, showRsi, resolvedTheme]);

  // Marcadores.
  useEffect(() => {
    const api = markersApiRef.current;
    if (!api) return;
    api.setMarkers(
      markers
        .filter((m) => candles[m.index])
        .map((m) => ({
          time: candles[m.index].time as UTCTimestamp,
          position: m.position ?? "aboveBar",
          color: chartColor(m.color, resolvedTheme, palette.accent),
          shape: m.shape ?? "arrowDown",
          text: m.text,
        })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers), candles, overlaysKey, resolvedTheme]);

  // Líneas horizontales.
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;
    priceLinesRef.current.forEach((line) => series.removePriceLine(line));
    priceLinesRef.current = priceLines.map((price) =>
      series.createPriceLine({
        price,
        color: palette.info,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: "",
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(priceLines), overlaysKey, resolvedTheme]);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={legendRef}
        className="num pointer-events-none absolute left-2 top-1.5 z-10 max-w-[68%] truncate rounded bg-bg/60 px-1 py-0.5 text-[9px] leading-none text-muted backdrop-blur-sm"
        aria-hidden="true"
      />
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}
