export type SearchType =
  | "leccion"
  | "glosario"
  | "libro"
  | "estudio"
  | "explicador"
  | "estrategia"
  | "ruta"
  | "pagina";

export type SearchItem = {
  id: string;
  type: SearchType;
  title: string;
  subtitle?: string;
  summary: string;
  href: string;
  keywords: string[];
};

export const TYPE_LABELS: Record<SearchType, string> = {
  leccion: "Lección",
  glosario: "Glosario",
  libro: "Libro",
  estudio: "Estudio",
  explicador: "Explicador",
  estrategia: "Estrategia",
  ruta: "Ruta guiada",
  pagina: "Página",
};
