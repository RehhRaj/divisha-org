
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


// import { connection } from "next/server";
// import { headers } from "next/headers";




// type PageData = {
//   page_type: "platform" | "tenant";
//   title: string;
//   message: string;
//   tenant: string | null;
// };

// async function getPageData(host: string): Promise<PageData | null> {
//   const apiUrl =
//     process.env.DJANGO_API_URL ??
//     "https://gtbtax.pythonanywhere.com/api/page/";

//   const url = new URL(apiUrl);
//   url.searchParams.set("host", host);

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     return null;
//   }

//   return response.json();
// }

// export default async function Page() {
//   // Read the request at runtime, not during the build.
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

//   if (!data) {
//     return (
//       <main style={{ padding: 40, fontFamily: "Arial" }}>
//         <h1>Page unavailable</h1>
//         <p>Could not load page data from Django.</p>
//         <p>Requested host: {host || "unknown"}</p>
//       </main>
//     );
//   }

//   return (
//     <main style={{ padding: 40, fontFamily: "Arial" }}>
//       <h1>{data.title}</h1>

//       <p>{data.message}</p>

//       <hr />

//       <p>
//         <strong>Page type:</strong> {data.page_type}
//       </p>

//       <p>
//         <strong>Requested host:</strong> {host}
//       </p>

//       <p>
//         <strong>Tenant:</strong> {data.tenant ?? "None"}
//       </p>
//     </main>
//   );
// }


import { connection } from "next/server";
import { headers } from "next/headers";
import HomePage from "@/app/HomePage"; // Aapka Home Page component

// 1. API se aane wale data ka TypeScript Type definition
type PageData = {
  page_type: "platform" | "tenant";
  title: string;
  message: string;
  tenant: string | null;
};

// 2. Django API se data fetch karne wala function
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

// 3. Main Next.js Server Component
export default async function Page() {
  // Runtime par request read karne ke liye (Next.js Dynamic Rendering)
  await connection();

  const requestHeaders = await headers();

  // Current domain/host nikalne ke liye
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

  // CASE 1: Agar API fail ho gayi ya data nahi mila (Jaise abc.divisha.org pe 404 aaya tha)
  if (!data) {
    return (
      <main style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Page unavailable</h1>
        <p>Could not load page data from Django.</p>
        <p>Requested host: {host || "unknown"}</p>
      </main>
    );
  }

  // CASE 2: Jab platform aaye ('tenant' value null ho ya page_type platform ho) -> Home Page Render hoga
  if (data.page_type === "platform" || data.tenant === null) {
    return (
      <>
        {/* Agar aapko pura custom HomePage component dikhana hai to ise use karein: */}
        <h1>{data.page_type} ptyhone naywhere se ayi hai</h1>
         <h1>{data.title} ptyhone naywhere se ayi hai</h1>
          <h1>{data.message} ptyhone naywhere se ayi hai</h1>
           <h1>{data.tenant} ptyhone naywhere se ayi hai</h1>
           <h1>{data.tenant} New Lintr added </h1>
           <h1>{data.tenant} <span style={{ color: 'tomato', fontSize: '24px' }}>New Line added</span></h1>

        <HomePage />
        
        {/* Ya agar aapko sirf text ya temporary layout dikhana ho to ise uncomment kar sakte hain:
        <main style={{ padding: 40, fontFamily: "Arial" }}>
          <h1>Business OS Home Page</h1>
          <p>{data.message}</p>
        </main> 
        */}
      </>
    );
  }

  // CASE 3: Jab tenant data aaye (Jaise 'jeetu' ya 'teal') -> Koi aur page render hoga
  if (data.page_type === "tenant") {
    
    // Aap yahan check kar sakte hain ki kaunsa tenant hai (e.g., jeetu ya teal)
    // Aur uske hisab se template badal sakte hain
    if (data.tenant === "jeetu") {
      return (
        <main style={{ padding: 40, fontFamily: "Arial" }}>
          <h1>Jeetu website not Website Template</h1>
          <p>Welcome to {data.title} Sub-site!</p>
          <p>{message hai --data.message}</p>
        </main>
      );
    }

    // Default tenant view agar koi specific condition match na ho
    return (
      <main style={{ padding: 40, fontFamily: "Arial" }}>
        <h1>Tenant Dashboard ({data.tenant})</h1>
        <h2>{data.title}</h2>
        <p>{data.message}</p>
        <hr />
        <p><strong>Requested host:</strong> {host}</p>
      </main>
    );
  }

  // Fallback condition agar kuch bhi match na kare
  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Website Not Configured</h1>
    </main>
  );
}
