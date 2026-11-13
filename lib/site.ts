/**
 * URL pública del sitio. En Vercel se puede fijar NEXT_PUBLIC_SITE_URL cuando
 * se conecte el dominio propio; mientras tanto, la app vive en Vercel.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://candlevic.vercel.app"
).replace(/\/+$/, "");
