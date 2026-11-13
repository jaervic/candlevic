"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f14",
          color: "#dce4ef",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#f0b429",
            }}
          >
            Candlevic
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 24 }}>
            Algo se rompió por aquí
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#9aa7b8",
            }}
          >
            La aplicación no pudo cargarse. Tu progreso sigue guardado en este
            dispositivo.
          </p>
          {error.digest && (
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 10,
                color: "#6b7787",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Referencia: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              border: 0,
              borderRadius: 12,
              padding: "11px 18px",
              background: "#f0b429",
              color: "#1a1305",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
