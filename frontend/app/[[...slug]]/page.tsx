
//  export default function Page() { 
//   return <h1>Welcome to the Page</h1>
//  }

// *****************************************************
// *****************************************************

// import HomePage from "@/app/HomePage";


// export default function Page() {
//   // STEP 1: API se aane wala data abhi hard-coded hai.
//   // Output dekhne ke liye in values ko change karein.

//   const site = {
//     level: "tenant",
//     template: "school",
//   };

//   // STEP 2: Data ke base par page select karein.

 
//   if (site.level === "tenant" && site.template === "school") {
//     return <h1>School Website</h1>;
//   }

//   if (site.level === "tenant" && site.template === "society") {
//     return <HomePage />;
//   }

//    if (site.level === "platform") {
//     return <h1>Business OS Home Page</h1>;
//   }


//   return <h1>Website Not Configured</h1>;
// }





// *****************************************************
// *****************************************************


import { connection } from "next/server";
import { headers } from "next/headers";

type PageData = {
  page_type: "platform" | "tenant";
  title: string;
  message: string;
  tenant: string | null;
};

async function getPageData(host: string): Promise<PageData | null> {
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

export default async function Page() {
  // Read the request at runtime, not during the build.
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

  try {
    data = await getPageData(host);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <main style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Page unavailable</h1>
        <p>Could not load page data from Django.</p>
        <p>Requested host: {host || "unknown"}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>{data.title}</h1>

      <p>{data.message}</p>

      <hr />

      <p>
        <strong>Page type:</strong> {data.page_type}
      </p>

      <p>
        <strong>Requested host:</strong> {host}
      </p>

      <p>
        <strong>Tenant:</strong> {data.tenant ?? "None"}
      </p>
    </main>
  );
}
