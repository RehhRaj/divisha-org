
import { headers } from "next/headers";

import HomePage from "@/app/HomePage";
import DemoPage from "@/app/DemoPage";
import TenantPage from "@/app/TenantPage";

import type { PageData } from "@/types/page";

function normalizeHost(rawHost: string): string {
  return rawHost
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
}

async function getPageData(
  host: string
): Promise<PageData | null> {
  const apiUrl =
    process.env.DJANGO_API_URL ??
    "https://gtbtax.pythonanywhere.com/api/page/";

  const url = new URL(apiUrl);
  url.searchParams.set("host", host);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(
      "Django API failed:",
      response.status,
      host
    );
    return null;
  }

  return (await response.json()) as PageData;
}

function ErrorPage({
  host,
  message,
}: {
  host: string;
  message: string;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">
        Website Unavailable
      </h1>
      <p>{message}</p>
      <p className="text-sm text-gray-500">
        Requested host: {host}
      </p>
    </main>
  );
}

export default async function Page() {
  const requestHeaders = await headers();

  const rawHost =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "";

  const host = normalizeHost(rawHost);

  if (!host) {
    return (
      <ErrorPage
        host="unknown"
        message="Invalid hostname."
      />
    );
  }

  let data: PageData | null = null;

  try {
    data = await getPageData(host);
  } catch (error) {
    console.error("Django API Error:", error);
  }

  if (!data) {
    return (
      <ErrorPage
        host={host}
        message="Could not load page data from Django."
      />
    );
  }

  switch (data.page_type) {
    case "platform":
      return <HomePage />;

    case "demo":
      return <DemoPage data={data} />;

    case "tenant":
    case "nested_tenant":
      return <TenantPage data={data} />;

    default:
      return (
        <ErrorPage
          host={host}
          message="Unknown page type."
        />
      );
  }
}
