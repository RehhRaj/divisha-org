// app/[[...slug]]/page.tsx
//
// This page decides what to show based on the website's hostname.
// Example: businessos.example shows the platform homepage;
// a customer's domain can show that customer's website.

import { connection, headers } from "next/server";
import { getContext } from "@/lib/context";
import HomePage from "@/app/HomePage";
import MessageView from "@/templates/MessageView";
import TemplateView from "@/templates/TemplateView";

export default async function Page() {
  // Wait for the real request because the hostname decides which tenant to show.
  // This is the modern alternative to `export const dynamic = "force-dynamic"`
  // when using Next.js Cache Components.
  await connection();

  const requestHeaders = await headers();
  const hostname =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "";

  // getContext looks up which website belongs to this hostname.
  const site = await getContext(hostname);

  // 1. Main Business OS marketing website.
  if (site.level === "platform") {
    return <HomePage />;
  }

  // 2. A customer website, if a template is configured for it.
  if (site.level === "tenant" && site.template) {
    return <TemplateView data={site} template={site.template} />;
  }

  // 3. A fallback page if the host is unknown or not configured.
  return <MessageView data={site} />;
}
