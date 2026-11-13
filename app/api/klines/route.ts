import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const INTERVALS = new Set(["1m", "5m", "15m", "1h", "4h", "1d", "1w"]);
const SYMBOLS = new Set([
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
]);

const COINBASE_PRODUCTS: Record<string, string> = {
  BTCUSDT: "BTC-USD",
  ETHUSDT: "ETH-USD",
  SOLUSDT: "SOL-USD",
  XRPUSDT: "XRP-USD",
  ADAUSDT: "ADA-USD",
  DOGEUSDT: "DOGE-USD",
};

const COINBASE_GRANULARITY: Record<
  string,
  { granularity: number; factor: number }
> = {
  "1m": { granularity: 60, factor: 1 },
  "5m": { granularity: 300, factor: 1 },
  "15m": { granularity: 900, factor: 1 },
  "1h": { granularity: 3600, factor: 1 },
  "4h": { granularity: 3600, factor: 4 },
  "1d": { granularity: 86400, factor: 1 },
  "1w": { granularity: 86400, factor: 7 },
};

type Candle = [number, number, number, number, number, number];

type ProviderResult = {
  candles: Candle[];
  source: string;
  sourceSymbol: string;
};

const HEADERS = {
  Accept: "application/json",
  "User-Agent": `Candlevic/1.0 (+${SITE_URL})`,
};

async function fetchBinance(
  base: string,
  symbol: string,
  interval: string,
  limit: number,
): Promise<ProviderResult> {
  const res = await fetch(
    `${base}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    {
      headers: HEADERS,
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    },
  );

  if (!res.ok) throw new Error(`${base} ${res.status}`);

  const rows = (await res.json()) as (string | number)[][];
  const candles: Candle[] = rows.map((row) => [
    Math.floor(Number(row[0]) / 1000),
    Number(row[1]),
    Number(row[2]),
    Number(row[3]),
    Number(row[4]),
    Number(row[5]),
  ]);

  if (candles.length < 10) throw new Error("empty");

  return {
    candles,
    source: base.includes("vision") ? "Binance Vision" : "Binance",
    sourceSymbol: symbol,
  };
}

function aggregate(candles: Candle[], factor: number): Candle[] {
  if (factor <= 1) return candles;

  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i += factor) {
    const group = candles.slice(i, i + factor);
    if (group.length === 0) continue;
    out.push([
      group[0][0],
      group[0][1],
      Math.max(...group.map((candle) => candle[2])),
      Math.min(...group.map((candle) => candle[3])),
      group[group.length - 1][4],
      group.reduce((sum, candle) => sum + candle[5], 0),
    ]);
  }
  return out;
}

async function fetchCoinbase(
  symbol: string,
  interval: string,
  limit: number,
): Promise<ProviderResult> {
  const product = COINBASE_PRODUCTS[symbol];
  const config = COINBASE_GRANULARITY[interval];
  if (!product || !config) throw new Error("unsupported");

  const res = await fetch(
    `https://api.exchange.coinbase.com/products/${product}/candles?granularity=${config.granularity}`,
    {
      headers: HEADERS,
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    },
  );

  if (!res.ok) throw new Error(`coinbase ${res.status}`);

  const rows = (await res.json()) as number[][];
  const candles: Candle[] = rows
    .map(
      (row): Candle => [
        Number(row[0]),
        Number(row[3]),
        Number(row[2]),
        Number(row[1]),
        Number(row[4]),
        Number(row[5]),
      ],
    )
    .reverse();

  const result = aggregate(candles, config.factor).slice(-limit);
  if (result.length < 10) throw new Error("empty");

  return {
    candles: result,
    source: "Coinbase",
    sourceSymbol: product,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") ?? "BTCUSDT").toUpperCase();
  const interval = searchParams.get("interval") ?? "1h";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 300), 50),
    1000,
  );
  const forced = searchParams.get("provider");

  if (!SYMBOLS.has(symbol) || !INTERVALS.has(interval)) {
    return NextResponse.json({ error: "BAD_PARAMS" }, { status: 400 });
  }

  const providers: Promise<ProviderResult>[] = [];

  if (forced !== "coinbase") {
    providers.push(
      fetchBinance("https://api.binance.com", symbol, interval, limit),
    );
    providers.push(
      fetchBinance(
        "https://data-api.binance.vision",
        symbol,
        interval,
        limit,
      ),
    );
  }

  if (forced !== "binance" && COINBASE_PRODUCTS[symbol]) {
    providers.push(fetchCoinbase(symbol, interval, limit));
  }

  if (providers.length === 0) {
    return NextResponse.json({ error: "BAD_PROVIDER" }, { status: 400 });
  }

  try {
    // El primero que responda gana. Binance bloquea algunas regiones,
    // así que Coinbase actúa como respaldo global.
    const result = await Promise.any(providers);
    return NextResponse.json({
      symbol,
      interval,
      source: result.source,
      sourceSymbol: result.sourceSymbol,
      candles: result.candles,
    });
  } catch {
    return NextResponse.json(
      { error: "UPSTREAM_UNAVAILABLE" },
      { status: 502 },
    );
  }
}
