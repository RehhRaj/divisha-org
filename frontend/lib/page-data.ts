import { headers } from "next/headers";

type Query = Record<string, string | undefined>;

export async function fetchPageData<T>(query: Query): Promise<T | null> {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0].trim();
  if (!host) return null;

  const apiUrl = process.env.DJANGO_API_URL
    ?? "https://gtbtax.pythonanywhere.com/api/page/";
  const url = new URL(apiUrl);
  url.searchParams.set("host", host);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  
  // const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
  
const response = await fetch(url, {
  signal: AbortSignal.timeout(6000),
  ...(process.env.NODE_ENV === "production"
    ? { next: { revalidate: 300 } }
    : { cache: "no-store" }),
});

  if (!response.ok) throw new Error(`Django page API returned ${response.status}`);
  return response.json();

}
