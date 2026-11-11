import { headers } from "next/headers";

/** Only trusted Divisha hosts and local development hosts may appear in SEO URLs. */
export async function getSeoOrigin(): Promise<string> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(",")[0].trim().toLowerCase();
  const local = /^(?:localhost|[a-z0-9-]+\.localhost|127\.0\.0\.1)(?::\d{1,5})?$/.test(host);
  const production = /^(?:[a-z0-9-]+\.)*divisha\.org$/.test(host);
  if (!local && !production) return "https://divisha.org";
  return `${local ? "http" : "https"}://${host}`;
}
