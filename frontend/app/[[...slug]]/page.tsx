import { cache } from "react";
import type { Metadata } from "next";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { TenantSite } from "../../templates/TenantSite";
import type { PublishedTenantSite } from "../../templates/types";

interface PublishedLanding {
  page_type: "platform_landing" | "business_landing";
  title: string;
  description: string;
  pricing?: string;
  links?: { label: string; href: string }[];
}

const loadPage = cache(async () => {
  const host = (await headers()).get("host");
  if (!host) notFound();

  const origin = process.env.DJANGO_API_ORIGIN;
  if (!origin) throw new Error("Set DJANGO_API_ORIGIN.");

  const url = new URL("/api/page/", origin);
  url.searchParams.set("host", host);

  const requestId = randomUUID();
  const response = await fetch(url, {
    headers: { "X-Request-ID": requestId },
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });

  console.info("request_id=%s django_status=%s", requestId, response.status);

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("The website could not be loaded.");

  const page: PublishedTenantSite | PublishedLanding = await response.json();
  const hostname = url.searchParams.get("host")?.toLowerCase().split(":")[0]?.replace(/\.$/, "");
  return { page, origin, hostname };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if ((await params).slug?.length) notFound();
  const { page, hostname } = await loadPage();
  const canonical = hostname && /^(?:[a-z0-9-]+\.)+[a-z0-9-]+$/.test(hostname) &&
    !hostname.endsWith(".localhost") && !/^[\d.]+$/.test(hostname)
    ? `https://${canonicalHostname(page, hostname)}/`
    : undefined;
  return { title: page.title, description: page.description, alternates: { canonical } };
}

function canonicalHostname(page: PublishedTenantSite | PublishedLanding, hostname: string) {
  return "page_type" in page && page.page_type === "platform_landing" &&
    hostname === "www.divisha.org" ? "divisha.org" : hostname;
}

type PageProps = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: PageProps) {
  if ((await params).slug?.length) notFound();
  const { page, origin } = await loadPage();

  if ("page_type" in page) {
    return (
      <main className="landing">
        <h1>{page.title}</h1>
        <p>{page.description}</p>

        {page.pricing && (
          <section aria-labelledby="pricing-heading">
            <h2 id="pricing-heading">Pricing</h2>
            <p className="pricing">{page.pricing}</p>
          </section>
        )}

        {(page.links?.length ?? 0) > 0 && (
          <nav aria-label="Business types">
            {page.links!.map(({ label, href }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </main>
    );
  }

  return <TenantSite page={page} loginUrl={new URL("/panel/login/", origin).href} />;
}
