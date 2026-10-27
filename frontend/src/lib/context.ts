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

// Server-only environment variables (never exposed to the browser).
//   BACKEND_URL        e.g. https://api.yourdomain.com   (no trailing slash needed)
//   BACKEND_API_TOKEN  shared secret, must equal INTERNAL_API_TOKEN on Django
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");
const BACKEND_API_TOKEN = process.env.BACKEND_API_TOKEN ?? "";

function failure(host: string, message: string): ContextResponse {
  return { message, level: "error", business_type: null, tenant: null, host };
}

export async function getContext(host: string): Promise<ContextResponse> {
  try {
    const headers: Record<string, string> = { "X-Original-Host": host };
    if (BACKEND_API_TOKEN) headers["X-Internal-Token"] = BACKEND_API_TOKEN;

    // 403/404 from Django (pending tenant, unknown host) still carry a JSON body, so no throw here.
    const res = await fetch(`${BACKEND_URL}/api/message/`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 401) {
      return failure(host, "Backend rejected the request: BACKEND_API_TOKEN does not match INTERNAL_API_TOKEN.");
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return failure(host, `Backend returned an unexpected response (HTTP ${res.status}). Check BACKEND_URL.`);
    }
    return (await res.json()) as ContextResponse;
  } catch {
    return failure(host, "Backend is not reachable. Check that Django is running and BACKEND_URL is correct.");
  }
}
