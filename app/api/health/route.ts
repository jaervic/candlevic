import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Endpoint mínimo para monitorización externa. No expone datos de usuarios.
 */
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "candlevic",
      time: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
