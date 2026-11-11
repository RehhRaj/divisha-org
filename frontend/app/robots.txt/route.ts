import { getSeoOrigin } from "@/lib/seo-host";

export const dynamic = "force-dynamic";

export async function GET() {
  const origin = await getSeoOrigin();
  // Do not Disallow beta pages: crawlers need access to see their noindex meta tag.
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
