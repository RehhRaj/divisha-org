import type { Metadata } from "next";
import { headers } from "next/headers";
import { PosDemo, type PosConfig } from "./pos-demo";

export const metadata: Metadata = {
  title: "Restaurant POS demo",
  robots: { index: false, follow: false },
};

export default async function PosPage() {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0].trim().toLowerCase();
  let config: PosConfig | null = null;
  const localDemo = process.env.NODE_ENV === "development" && /^[a-z0-9-]+\.localhost(?::[0-9]+)?$/.test(host);
  // Hosted demo is opt-in: set POS_DEMO_ENABLED=1 here and DJANGO_POS_DEMO=1 on Django.
  const hostedDemo = process.env.POS_DEMO_ENABLED === "1" && /^[a-z0-9-]+\.divisha\.org$/.test(host);
  if (localDemo || hostedDemo) {
    try {
      const apiBase = process.env.DJANGO_API_URL ?? (localDemo ? "http://127.0.0.1:8000" : "https://gtbtax.pythonanywhere.com");
      const endpoint = new URL("/api/pos/demo-config/", apiBase);
      endpoint.searchParams.set("host", host);
      const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(6000) });
      if (response.ok) config = await response.json();
    } catch {
      return <main><h1>POS demo configuration unavailable</h1><p>Check the local Django server and reload.</p></main>;
    }
  }
  if (!config) return <main><h1>POS unavailable</h1><a href="/">Return to website</a></main>;
  return <PosDemo key={config.tenant} config={config} />;
}
