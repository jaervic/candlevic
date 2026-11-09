import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get("symbol") ?? "BTCUSDT").toUpperCase();
  const interval = searchParams.get("interval") ?? "1h";
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") ?? 300), 50),
    1000,
  );

  if (!SYMBOLS.has(symbol) || !INTERVALS.has(interval)) {
    return NextResponse.json({ error: "BAD_PARAMS" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) throw new Error(`Binance ${res.status}`);

    const rows = (await res.json()) as (string | number)[][];
    const candles = rows.map((r) => [
      Math.floor(Number(r[0]) / 1000),
      Number(r[1]),
      Number(r[2]),
      Number(r[3]),
      Number(r[4]),
      Number(r[5]),
    ]);

    return NextResponse.json({
      symbol,
      interval,
      source: "Binance",
      candles,
    });
  } catch {
    return NextResponse.json(
      { error: "UPSTREAM_UNAVAILABLE" },
      { status: 502 },
    );
  }
}
