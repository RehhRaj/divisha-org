import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { TenantSite, type PublishedTenantSite } from "../../templates/TenantSite";

interface PublishedLanding {
  page_type: "platform_landing" | "business_landing";
  title: string;
  description: string;
  pricing?: string;
  links?: { label: string; href: string }[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  if ((await params).slug?.length) notFound();

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
