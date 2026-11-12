import { ImageResponse } from "next/og";

export const alt = "Candlevic — Aprende trading viendo velas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f14",
          color: "#dce4ef",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 32,
            letterSpacing: "-1px",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#f0b429",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1b1405",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            C
          </div>
          candlevic
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2.5px",
              maxWidth: 940,
            }}
          >
            Aprende trading viendo velas
          </div>
          <div
            style={{
              fontSize: 31,
              color: "#9aa7b8",
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            Lecciones cortas, gráficos interactivos y práctica guiada. Gratis y
            sin registro.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            fontSize: 23,
            color: "#f0b429",
          }}
        >
          <span>38 lecciones</span>
          <span>·</span>
          <span>Laboratorio</span>
          <span>·</span>
          <span>Trading demo</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
