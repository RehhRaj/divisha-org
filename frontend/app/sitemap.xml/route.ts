import { fetchPageData } from "@/lib/page-data";
import type { SitePage } from "@/templates/types";
import type { PageData } from "@/types/page";
import { getSeoOrigin } from "@/lib/seo-host";

export const dynamic = "force-dynamic";

type SeoPage = (SitePage & { seo: SitePage["seo"] & { indexable?: boolean } }) | PageData;

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const origin = await getSeoOrigin();
  const urls: string[] = [];
  try {
    const data = await fetchPageData<SeoPage>({});
    // Beta default is false. A future verified customer may explicitly opt in.
    if (data && "template_variant" in data && data.seo?.indexable === true) {
      urls.push(`${origin}/`);
      if (data.sections.show_items) {
        const section = data.template === "tour" ? "packages" : "offerings";
        for (const item of data.items) {
          if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
            urls.push(`${origin}/${section}/${item.slug}`);
          }
        }
      }
    }
  } catch {
    // API failure: never accidentally publish demo URLs to a sitemap.
  }
  const entries = urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}${entries ? "\n" : ""}</urlset>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
