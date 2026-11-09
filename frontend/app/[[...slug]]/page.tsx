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
  return <TemplateView page={data} basePath={basePath} />;
}
