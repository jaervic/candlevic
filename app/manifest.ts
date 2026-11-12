import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Candlevic — Aprende trading viendo velas",
    short_name: "Candlevic",
    description:
      "Lecciones cortas, gráficos interactivos y práctica real para aprender trading de acciones y cripto. Gratis y sin registro.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    orientation: "portrait",
    lang: "es",
    categories: ["education", "finance"],
    shortcuts: [
      {
        name: "Trading demo",
        short_name: "Demo",
        description: "Practica con dinero virtual",
        url: "/demo",
      },
      {
        name: "Laboratorio",
        short_name: "Lab",
        description: "Gráficos e indicadores",
        url: "/lab",
      },
    ],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
