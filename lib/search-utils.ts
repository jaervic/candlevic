import type { SearchItem } from "./search-types";

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchItems(
  items: SearchItem[],
  query: string,
  limit = 12,
): SearchItem[] {
  const normalized = normalizeSearchText(query).trim();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);

  const scored = items
    .map((item) => {
      const title = normalizeSearchText(item.title);
      const subtitle = normalizeSearchText(item.subtitle ?? "");
      const summary = normalizeSearchText(item.summary);
      const keywords = normalizeSearchText(item.keywords.join(" "));

      let score = 0;
      for (const token of tokens) {
        let tokenScore = 0;
        if (title === token) tokenScore = 50;
        else if (title.startsWith(token)) tokenScore = 34;
        else if (title.includes(token)) tokenScore = 24;
        else if (keywords.includes(token)) tokenScore = 14;
        else if (subtitle.includes(token)) tokenScore = 8;
        else if (summary.includes(token)) tokenScore = 5;

        if (tokenScore === 0) return null;
        score += tokenScore;
      }

      if (title.includes(normalized)) score += 20;
      return { item, score };
    })
    .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.item);
}
