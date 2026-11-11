import { describe, expect, it } from "vitest";
import { searchItems } from "./search-utils";
import type { SearchItem } from "./search-types";

const items: SearchItem[] = [
  {
    id: "l:soporte",
    type: "leccion",
    title: "Soporte y resistencia",
    summary: "Zonas donde el precio reacciona.",
    href: "/aprender/soporte-resistencia",
    keywords: ["tendencia", "niveles"],
  },
  {
    id: "g:rsi",
    type: "glosario",
    title: "RSI",
    summary: "Oscilador de fuerza relativa.",
    href: "/aprender/glosario?q=RSI",
    keywords: ["indicador", "sobrecompra"],
  },
  {
    id: "e:inflacion",
    type: "explicador",
    title: "IPC / CPI: la inflación",
    summary: "El dato que mueve los tipos.",
    href: "/radar/cpi",
    keywords: ["inflación", "precios"],
  },
];

describe("searchItems", () => {
  it("devuelve vacío con una consulta vacía", () => {
    expect(searchItems(items, "   ")).toEqual([]);
  });

  it("prioriza coincidencias en el título", () => {
    const results = searchItems(items, "soporte");
    expect(results[0]?.id).toBe("l:soporte");
  });

  it("ignora acentos y mayúsculas", () => {
    const results = searchItems(items, "INFLACION");
    expect(results[0]?.id).toBe("e:inflacion");
  });

  it("busca en palabras clave y resumen", () => {
    expect(searchItems(items, "sobrecompra")[0]?.id).toBe("g:rsi");
    expect(searchItems(items, "reacciona")[0]?.id).toBe("l:soporte");
  });

  it("exige que coincidan todos los términos", () => {
    expect(searchItems(items, "soporte rsi")).toEqual([]);
  });
});
