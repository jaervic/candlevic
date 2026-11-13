import { XMLParser } from "fast-xml-parser";
import { SITE_URL } from "./site";

export type NewsCategory = "cripto" | "macro" | "acciones";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
  excerpt: string;
  tags: string[];
};

type Feed = {
  name: string;
  url: string;
  category: NewsCategory;
};

const FEEDS: Feed[] = [
  {
    name: "Criptonoticias",
    url: "https://www.criptonoticias.com/feed/",
    category: "cripto",
  },
  {
    name: "Investing · Cripto",
    url: "https://es.investing.com/rss/news_301.rss",
    category: "cripto",
  },
  {
    name: "Investing · Bolsa",
    url: "https://es.investing.com/rss/news_25.rss",
    category: "acciones",
  },
  {
    name: "Investing · Economía",
    url: "https://es.investing.com/rss/news_95.rss",
    category: "macro",
  },
  {
    name: "El País · Economía",
    url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia/portada",
    category: "macro",
  },
];

const UA =
  `Mozilla/5.0 (compatible; CandlevicBot/1.0; +${SITE_URL})`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  cdataPropName: "__cdata",
});

const TAG_RULES: [RegExp, string][] = [
  [/\b(bitcoin|btc)\b/i, "BTC"],
  [/\b(ethereum|ether|eth)\b/i, "ETH"],
  [/\b(solana|sol)\b/i, "SOL"],
  [/\b(fed|fomc|powell|jerome powell)\b/i, "Fed"],
  [/\b(inflaci[oó]n|inflation|cpi|ipc)\b/i, "Inflación"],
  [/\b(etf)\b/i, "ETF"],
  [/\b(sec|cftc|regulaci[oó]n|regulator|lawsuits?)\b/i, "Regulación"],
  [/\b(stablecoins?|tether|usdc)\b/i, "Stablecoins"],
  [/\b(earnings|resultados|beneficios)\b/i, "Resultados"],
  [/\b(gold|oro)\b/i, "Oro"],
  [/\b(dollar|d[oó]lar|treasury|bonos|yields?)\b/i, "Dólar"],
  [/\b(halving|halvening)\b/i, "Halving"],
  [/\b(hack|exploit|robo|breach)\b/i, "Seguridad"],
];

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return text(obj["#text"] ?? obj.__cdata ?? "");
  }
  return "";
}

function linkOf(item: Record<string, unknown>): string {
  const link = item.link;
  if (typeof link === "string") return link.trim();
  if (Array.isArray(link)) {
    for (const entry of link) {
      const value = text(entry) || text((entry as Record<string, unknown>)?.["@_href"]);
      if (value) return value;
    }
  }
  if (link && typeof link === "object") {
    const obj = link as Record<string, unknown>;
    return text(obj["@_href"] ?? obj["#text"] ?? "");
  }
  const guid = item.guid;
  return text(guid);
}

function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&hellip;/gi, "…")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, max = 180) {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max)}…`;
}

function tagsFor(text: string) {
  return TAG_RULES.filter(([re]) => re.test(text))
    .map(([, tag]) => tag)
    .slice(0, 3);
}

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

function parseFeedDate(raw: string): Date | null {
  const value = raw.trim();
  if (!value) return null;

  // Fechas sin zona horaria (p. ej. "2026-11-09 02:29:07"): se interpretan como UTC.
  const naive = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/.exec(value);
  const date = naive
    ? new Date(`${naive[1]}T${naive[2]}Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  // Si la fuente publica una fecha futura por error de zona, se acota a ahora.
  const now = Date.now();
  if (date.getTime() > now + 10 * 60 * 1000) return new Date(now);
  return date;
}

async function fetchFeed(feed: Feed): Promise<NewsItem[]> {
  const res = await fetch(feed.url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: 900 },
    signal: AbortSignal.timeout(7000),
  });

  if (!res.ok) throw new Error(`${feed.name}: HTTP ${res.status}`);

  const xml = await res.text();
  const parsed = parser.parse(xml) as Record<string, unknown>;
  const rss = parsed.rss as Record<string, unknown> | undefined;
  const feedNode = parsed.feed as Record<string, unknown> | undefined;
  const channel = (rss?.channel ?? feedNode) as
    | Record<string, unknown>
    | undefined;

  const rawItems = asArray(
    (channel?.item ?? channel?.entry) as
      | Record<string, unknown>
      | Record<string, unknown>[]
      | undefined,
  );

  return rawItems
    .map((item) => {
      const title = cleanHtml(text(item.title));
      const link = linkOf(item);
      const description = cleanHtml(
        text(
          item.description ??
            item.summary ??
            item["content:encoded"] ??
            item.content,
        ),
      );
      const dateRaw = text(
        item.pubDate ?? item.published ?? item.updated ?? item["dc:date"],
      );
      const published = parseFeedDate(dateRaw);
      const publishedAt = published ? published.toISOString() : new Date().toISOString();

      if (!title || !link) return null;

      return {
        id: `${feed.name}:${link}`,
        title,
        link,
        source: feed.name,
        category: feed.category,
        publishedAt,
        excerpt: truncate(description),
        tags: tagsFor(`${title} ${description}`),
      } satisfies NewsItem;
    })
    .filter((item): item is NewsItem => item !== null);
}

export type NewsResult = {
  items: NewsItem[];
  updatedAt: string;
  degraded: boolean;
  failedFeeds: number;
  totalFeeds: number;
};

export async function getNews(): Promise<NewsResult> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const all: NewsItem[] = [];
  let failedFeeds = 0;
  for (const result of results) {
    if (result.status === "fulfilled") all.push(...result.value);
    else failedFeeds += 1;
  }

  const seenTitles = new Set<string>();
  const seenLinks = new Set<string>();
  const perSource = new Map<string, number>();
  const items = all
    .filter((item) => {
      const titleKey = normalizeTitle(item.title);
      if (seenTitles.has(titleKey) || seenLinks.has(item.link)) return false;
      const count = perSource.get(item.source) ?? 0;
      if (count >= 8) return false;
      perSource.set(item.source, count + 1);
      seenTitles.add(titleKey);
      seenLinks.add(item.link);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 36);

  return {
    items,
    updatedAt: new Date().toISOString(),
    degraded: items.length === 0,
    failedFeeds,
    totalFeeds: FEEDS.length,
  };
}
