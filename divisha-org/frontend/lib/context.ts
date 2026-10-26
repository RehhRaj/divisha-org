// What Django's /api/message/ returns. The backend decides the content
// (message, modules, theme, layout); the frontend only draws it.

export type ModuleItem = { key: string; label: string };

export type TemplateData = {
  key: string;
  name: string;
  layout: string; // "sidebar" | "cards"
  theme: { primary: string; [name: string]: string };
  modules: ModuleItem[];
};

export type ContextResponse = {
  message: string;
  level: "platform" | "business_type" | "tenant" | "unknown" | "error";
  business_type: string | null;
  tenant: string | null;
  host: string;
  tenant_name?: string | null;
  status?: string | null;
  custom_domain?: string | null;
  contact?: string | null;
  template?: TemplateData | null;
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function getContext(host: string): Promise<ContextResponse> {
  try {
    // 403/404 from Django (pending tenant, unknown host) still carry a JSON body, so no throw here.
    const res = await fetch(`${BACKEND_URL}/api/message/`, {
      headers: { "X-Original-Host": host },
      cache: "no-store",
    });
    return (await res.json()) as ContextResponse;
  } catch {
    return {
      message: "Backend is not reachable. Is Django running?",
      level: "error",
      business_type: null,
      tenant: null,
      host,
    };
  }
}
