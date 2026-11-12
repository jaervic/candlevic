"use client";

import Script from "next/script";

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;

  const src =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
