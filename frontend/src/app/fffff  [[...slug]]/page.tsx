import { headers } from "next/headers";

import { getContext } from "@/lib/context";
import HomePage from "@/app/HomePage";
import MessageView from "@/templates/MessageView";
import TemplateView from "@/templates/TemplateView";

// Always render per request: tenant pages depend on the hostname.
// export const dynamic = "force-dynamic";

export default async function Page() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const data = await getContext(host);

  // The platform root gets the marketing homepage; tenant and business-type
  // hosts continue to use the metadata-driven templates and existing messages.
  if (data.level === "platform") return <HomePage />;
  if (data.level === "tenant" && data.template) {
    return <TemplateView data={data} template={data.template} />;
  }
  return <MessageView data={data} />;
}
