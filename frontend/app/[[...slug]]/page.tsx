import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const templates: Record<string, string> = {
  "restaurant-classic": "restaurant",
  "education-classic": "education",
};

interface PublishedPage {
  title: string;
  description: string;
  template: string;
}

export default async function Page({ params }: {
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
  const page: PublishedPage = await response.json();
  if (!Object.hasOwn(templates, page.template)) throw new Error("Unsupported website template.");
  return (
    <main className={templates[page.template]}>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
    </main>
  );
}
