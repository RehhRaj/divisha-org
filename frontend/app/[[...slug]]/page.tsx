import { connection } from "next/server";
import { headers } from "next/headers";

import HomePage from "@/app/HomePage";
import TenantPage from "@/app/TenantPage";
import DemoPage from "@/app/DemoPage";


type PageData = {
  page_type: "platform" | "demo" | "tenant";

  business_type: string | null;

  tenant: string | null;

  title: string;

  message: string;

  template: string;
};


async function getPageData(
  host: string
): Promise<PageData | null> {

  const apiUrl =
    process.env.DJANGO_API_URL ??
    "https://gtbtax.pythonanywhere.com/api/page/";

  const url = new URL(apiUrl);

  url.searchParams.set("host", host);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}


// export default async function Page() {

//   await connection();

//   const requestHeaders = await headers();

//   const host = (
//     requestHeaders.get("x-forwarded-host") ??
//     requestHeaders.get("host") ??
//     ""
//   )
//     .split(",")[0]
//     .trim()
//     .toLowerCase()
//     .replace(/\.$/, "");


//   let data: PageData | null = null;

//   try {

//     data = await getPageData(host);

//   } catch {

//     data = null;

//   }


//   // CASE 1: Invalid domain or API error

//   if (!data) {

//     return (
//       <main style={{ padding: 40 }}>
//         <h1>Website Not Found</h1>
//         <p>Website configuration could not be loaded.</p>
//       </main>
//     );

//   }


//   // CASE 2: Main SaaS website

//   if (data.page_type === "platform") {

//     return <HomePage />;

//   }


//   // CASE 3: Business type demo website

//   if (data.page_type === "demo") {

//     return <DemoPage data={data} />;

//   }


//   // CASE 4: Actual tenant website

//   if (data.page_type === "tenant") {

//     return <TenantPage data={data} />;

//   }


//   // CASE 5: Fallback

//   return (
//     <main>
//       <h1>Website Not Configured</h1>
//     </main>
//   );

// }




export default async function Page() {

  await connection();

  const requestHeaders = await headers();

  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");

  let data: PageData | null = null;
  let errorMessage = "";

  try {

    data = await getPageData(host);

  } catch (error) {

    errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown API error";

  }

  console.log("========== DOMAIN DEBUG ==========");
  console.log("HOST:", host);
  console.log("API DATA:", data);
  console.log("API ERROR:", errorMessage);
  console.log("==================================");

  return (
    <main style={{ padding: 40 }}>

      <h1>Next.js Domain Routing Test</h1>

      <p><strong>Host:</strong> {host}</p>

      <p><strong>Page Type:</strong> {data?.page_type ?? "NULL"}</p>

      <p><strong>Tenant:</strong> {data?.tenant ?? "NULL"}</p>

      <p><strong>API Error:</strong> {errorMessage || "None"}</p>

      <hr />

      {data?.page_type === "platform" && <HomePage />}

      {data?.page_type === "demo" && <DemoPage data={data} />}

      {data?.page_type === "tenant" && <TenantPage data={data} />}

      {!data && <h2>Website Not Found</h2>}

    </main>
  );
}
