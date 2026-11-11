import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import HomePage from "@/app/HomePage";
import DemoPage from "@/app/DemoPage";
import TenantPage from "@/app/TenantPage";
import { fetchPageData } from "@/lib/page-data";
import { TemplateView } from "@/templates/TemplateView";
import type { SitePage } from "@/templates/types";
import type { PageData } from "@/types/page";

type RouteProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ variant?: string | string[] }>;
};

/**
 * Beta SEO: every public URL has its own metadata, but sample sites stay noindex.
 * The same Django SEO fields can later be populated with real customer content.
 */
export async function generateMetadata({ params, searchParams }: RouteProps): Promise<Metadata> {
  const [{ slug = [] }, { variant }] = await Promise.all([params, searchParams]);
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0].trim().toLowerCase();
  const isLocal = /^(localhost|[a-z0-9-]+\.localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const safeHost = /^(?:[a-z0-9-]+\.)*divisha\.org$/.test(host) || isLocal;
  const origin = safeHost ? `${isLocal ? "http" : "https"}://${host}` : "https://divisha.org";
  const path = slug.length ? `/${slug.map(encodeURIComponent).join("/")}` : "/";
  const canonical = `${origin}${path}`;

  const fallback = "Business OS — Your business. Your website.";
  const noIndex = { index: false, follow: true };
  if (Array.isArray(variant) || slug.length > 3) {
    return { title: fallback, robots: noIndex };
  }

  const showcase = slug[0] === "showcase" ? slug[1] : undefined;
  const subpath = showcase ? slug.slice(2) : slug;
  const collection = subpath[0];
  const itemSlug = subpath[1];
  // Don't fetch a normal page for unrelated routes (e.g. /demos/*).
  if (slug[0] === "demos" || (collection && !["packages", "offerings"].includes(collection))) {
    return { title: fallback, robots: noIndex };
  }

  try {
    const data = await fetchPageData<PageData | SitePage>({ showcase, variant });
    if (!data) return { title: fallback, robots: noIndex };
    let title = data.title || fallback;
    let description = data.message || "Divisha business website preview.";
    if ("template_variant" in data) {
      title = data.seo?.meta_title || title;
      description = data.seo?.meta_description || description;
      if (itemSlug) {
        const item = data.items.find((entry) => entry.slug === itemSlug);
        if (item) {
          title = `${item.title} | ${data.title}`;
          description = item.description || description;
        }
      }
    }
    return {
      title,
      description,
      alternates: { canonical },
      robots: noIndex,
      openGraph: { title, description, url: canonical, type: "website" },
    };
  } catch {
    // Metadata failure must not break the already-working website.
    return { title: fallback, robots: noIndex };
  }
}

/** Sample Restaurant JSON-LD for testing only; beta pages remain noindex. */
function restaurantJsonLd(page: SitePage, url: string) {
  // if (page.template !== "restau") return null;

if (page.business_type !== "restau") return null;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: page.title,
    description: page.seo?.meta_description || page.message,
    url,
    hasMenu: `${url}#menu`,
    // Contact/address are intentionally omitted from beta schema until verified.
  };
}

export default async function Page({ params, searchParams }: RouteProps) {
  const [{ slug = [] }, { variant }] = await Promise.all([params, searchParams]);
  if (Array.isArray(variant)) notFound();

  const showcase = slug[0] === "showcase" ? slug[1] : undefined;
  if (slug[0] === "showcase" && !showcase) notFound();
  const subpath = showcase ? slug.slice(2) : slug;
  if (subpath.length > 2 || (subpath[0] && !["packages", "offerings"].includes(subpath[0]))) {
    notFound();
  }

  const data = await fetchPageData<PageData | SitePage>({ showcase, variant });
  if (!data) notFound();
  if (data.page_type === "platform") {
    if (slug.length || variant !== undefined) notFound();
    return <HomePage />;
  }

  if (!("template_variant" in data)) {
    if (slug.length || variant !== undefined) notFound();
    if (data.page_type === "demo") return <DemoPage data={data} />;
    if (data.page_type === "tenant" || data.page_type === "nested_tenant") return <TenantPage data={data} />;
    notFound();
  }

  const basePath = showcase ? `/showcase/${encodeURIComponent(showcase)}/` : "/";
  const [collection, itemSlug] = subpath;
  if (collection) {
    const expected = data.template === "tour" ? "packages" : "offerings";
    if (collection !== expected || !data.sections.show_items) notFound();
    if (!itemSlug) {
      const query = data.page_type === "demo" && variant ? `?variant=${encodeURIComponent(variant)}` : "";
      const target = data.content.secondary_cta.link;
      const hash = /^#[a-z][a-z0-9-]*$/i.test(target) ? target : "";
      redirect(basePath + query + hash);
    }
    const item = data.items.find((offering) => offering.slug === itemSlug);
    if (!item) notFound();
    return <TemplateView page={data} basePath={basePath} item={item} />;
  }
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0].trim().toLowerCase();
  const isLocal = /^(localhost|[a-z0-9-]+\.localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const safeHost = /^(?:[a-z0-9-]+\.)*divisha\.org$/.test(host) || isLocal;
  const origin = safeHost ? `${isLocal ? "http" : "https"}://${host}` : "https://divisha.org";
  const structuredData = restaurantJsonLd(data, `${origin}${basePath}`);
  return <>
    {structuredData && <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
    <TemplateView page={data} basePath={basePath} />
  </>;
}
