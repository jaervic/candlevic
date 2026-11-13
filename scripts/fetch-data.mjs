/**
 * Descarga los datasets didácticos (una vez, en desarrollo).
 * Uso: node scripts/fetch-data.mjs
 *
 * Fuentes gratuitas:
 *  - Binance public API (cripto, sin key)
 *  - Yahoo Finance chart API (acciones, sin key)
 */
import { mkdir, writeFile } from "node:fs/promises";

const OUT = new URL("../data/", import.meta.url);
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const round = (n, d = 2) => Number(n.toFixed(d));

async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
    }
  }
}

async function binance({ symbol, interval, startTime, endTime, limit = 800 }) {
  const params = new URLSearchParams({
    symbol,
    interval,
    limit: String(limit),
  });
  if (startTime) params.set("startTime", String(startTime));
  if (endTime) params.set("endTime", String(endTime));
  const rows = await getJSON(
    `https://api.binance.com/api/v3/klines?${params.toString()}`,
  );
  return rows.map((r) => [
    Math.floor(Number(r[0]) / 1000),
    round(Number(r[1])),
    round(Number(r[2])),
    round(Number(r[3])),
    round(Number(r[4])),
    round(Number(r[5]), 2),
  ]);
}

async function yahoo({ symbol, range = "2y", period1, period2, interval = "1d" }) {
  const query =
    period1 && period2
      ? `period1=${Math.floor(period1 / 1000)}&period2=${Math.floor(period2 / 1000)}`
      : `range=${range}`;
  const data = await getJSON(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?${query}&interval=${interval}`,
  );
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error(`Sin datos para ${symbol}`);
  const ts = result.timestamp ?? [];
  const q = result.indicators.quote[0];
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    if (q.open[i] == null || q.close[i] == null) continue;
    out.push([
      ts[i],
      round(q.open[i]),
      round(q.high[i]),
      round(q.low[i]),
      round(q.close[i]),
      Math.round(q.volume[i] ?? 0),
    ]);
  }
  return out;
}

async function save(name, payload) {
  await mkdir(OUT, { recursive: true });
  await writeFile(
    new URL(`${name}.json`, OUT),
    JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }),
  );
  console.log(
    `✓ ${name} (${payload.candles.length} velas) ${payload.symbol}`,
  );
}

const jobs = [
  {
    name: "btc-1d",
    run: () =>
      binance({ symbol: "BTCUSDT", interval: "1d", limit: 700 }).then((c) => ({
        symbol: "BTCUSDT",
        interval: "1d",
        source: "Binance",
        candles: c,
      })),
  },
  {
    name: "eth-1d",
    run: () =>
      binance({ symbol: "ETHUSDT", interval: "1d", limit: 700 }).then((c) => ({
        symbol: "ETHUSDT",
        interval: "1d",
        source: "Binance",
        candles: c,
      })),
  },
  {
    name: "btc-4h",
    run: () =>
      binance({ symbol: "BTCUSDT", interval: "4h", limit: 500 }).then((c) => ({
        symbol: "BTCUSDT",
        interval: "4h",
        source: "Binance",
        candles: c,
      })),
  },
  {
    name: "btc-covid",
    run: () =>
      binance({
        symbol: "BTCUSDT",
        interval: "1d",
        startTime: Date.UTC(2020, 0, 1),
        endTime: Date.UTC(2020, 5, 30),
        limit: 400,
      }).then((c) => ({
        symbol: "BTCUSDT",
        interval: "1d",
        source: "Binance",
        note: "Crash COVID 2020",
        candles: c,
      })),
  },
  {
    name: "btc-bear-2022",
    run: () =>
      binance({
        symbol: "BTCUSDT",
        interval: "1d",
        startTime: Date.UTC(2021, 10, 1),
        endTime: Date.UTC(2022, 11, 31),
        limit: 500,
      }).then((c) => ({
        symbol: "BTCUSDT",
        interval: "1d",
        source: "Binance",
        note: "Mercado bajista 2021-2022",
        candles: c,
      })),
  },
  {
    name: "spy-1d",
    run: () =>
      yahoo({ symbol: "SPY", range: "2y" }).then((c) => ({
        symbol: "SPY",
        interval: "1d",
        source: "Yahoo Finance",
        candles: c,
      })),
  },
  {
    name: "tsla-1d",
    run: () =>
      yahoo({ symbol: "TSLA", range: "2y" }).then((c) => ({
        symbol: "TSLA",
        interval: "1d",
        source: "Yahoo Finance",
        candles: c,
      })),
  },
  {
    name: "spy-2008",
    run: () =>
      yahoo({
        symbol: "SPY",
        period1: Date.UTC(2007, 0, 1),
        period2: Date.UTC(2009, 11, 31),
      }).then((c) => ({
        symbol: "SPY",
        interval: "1d",
        source: "Yahoo Finance",
        note: "Crisis financiera 2007-2009",
        candles: c,
      })),
  },
  {
    name: "n225-1990",
    run: () =>
      yahoo({
        symbol: "^N225",
        period1: Date.UTC(1989, 0, 1),
        period2: Date.UTC(2010, 11, 31),
        interval: "1wk",
      }).then((c) => ({
        symbol: "N225",
        interval: "1wk",
        source: "Yahoo Finance",
        note: "Nikkei 225, burbuja y década perdida (1989-2010)",
        candles: c,
      })),
  },
];

for (const job of jobs) {
  try {
    await save(job.name, await job.run());
  } catch (err) {
    console.error(`✗ ${job.name}: ${err.message}`);
  }
}
