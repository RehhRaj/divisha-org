import { connection } from "next/server";
import { headers } from "next/headers";

import HomePage from "@/app/HomePage";
import TenantPage from "@/app/TenantPage";
import DemoPage from "@/app/DemoPage";


// ---------------------------------------
// 1. API RESPONSE TYPE
// ---------------------------------------

type PageData = {
  page_type: "platform" | "demo" | "tenant";

  business_type: string | null;

  tenant: string | null;

  parent_tenant: string | null;

  title: string;

  message: string;

  template: string;
};


// ---------------------------------------
// 2. FETCH DATA FROM DJANGO
// ---------------------------------------

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

  const data: PageData = await response.json();

  return data;
}


// ---------------------------------------
// 3. MAIN PAGE
// ---------------------------------------

export default async function Page() {

  // Ensure request-time rendering
  await connection();

  // Read incoming request headers
  const requestHeaders = await headers();

  const rawHost =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "";

  const host = rawHost
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");


  // -------------------------------------
  // 4. GET DJANGO DATA
  // -------------------------------------

  let data: PageData | null = null;

  try {

    data = await getPageData(host);

  } catch (error) {

    console.error("Django API Error:", error);

    data = null;
  }


  // -------------------------------------
  // 5. ERROR PAGE
  // -------------------------------------

  if (!data) {

    return (
      <main style={{ padding: 40 }}>
        <h1>Website Not Found</h1>

        <p>
          Website configuration could not be loaded.
        </p>

        <p>Host: {host}</p>
      </main>
    );
  }


  // -------------------------------------
  // 6. PLATFORM
  // -------------------------------------

  if (data.page_type === "platform") {

    return <HomePage />;
  }


  // -------------------------------------
  // 7. BUSINESS DEMO
  // -------------------------------------

  if (data.page_type === "demo") {

    return <DemoPage data={data} />;
  }


  // -------------------------------------
  // 8. TENANT WEBSITE
  // -------------------------------------

  if (data.page_type === "tenant") {

    return <TenantPage data={data} />;
  }


  // -------------------------------------
  // 9. FALLBACK
  // -------------------------------------

  return (
    <main style={{ padding: 40 }}>
      <h1>Website Not Configured</h1>
    </main>
  );
}