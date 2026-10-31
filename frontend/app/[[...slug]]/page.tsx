import { connection } from "next/server"; import { headers } from "next/headers";

export default async function Page() {

await connection();

const requestHeaders = await headers();

const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "HOST NOT FOUND";

const apiUrl = process.env.DJANGO_API_URL ?? "https://gtbtax.pythonanywhere.com/api/page/";

const url = new URL(apiUrl);

url.searchParams.set("host", host.split(",")[0].trim());

let apiResponse = ""; let status = 0;

try {

const response = await fetch(url, {
  cache: "no-store",
});

status = response.status;

apiResponse = await response.text();


} catch (error) {

apiResponse = String(error);


}

return ( <main style={{ padding: 40, fontFamily: "Arial" }}>

  <h1>Domain Debugging</h1>

  <hr />

  <h3>1. Original Host</h3>
  <p>{host}</p>

  <h3>2. API URL</h3>
  <p>{url.toString()}</p>

  <h3>3. API Status</h3>
  <p>{status}</p>

  <h3>4. Django Response</h3>

  <pre style={{ whiteSpace: "pre-wrap" }}>
    {apiResponse}
  </pre>

</main>


); }