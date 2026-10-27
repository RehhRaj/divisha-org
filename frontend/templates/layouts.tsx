import type { CSSProperties, ReactElement } from "react";
import type { ContextResponse, TemplateData } from "@/lib/context";

export type LayoutProps = { data: ContextResponse; template: TemplateData };

const PANEL = "#1e293b";

function Details({ data, template }: LayoutProps) {
  const rows: [string, string | null | undefined][] = [
    ["Business type", data.business_type],
    ["Template", template.name],
    ["Domain", data.custom_domain ?? data.host],
    ["Contact", data.contact],
  ];
  return (
    <dl style={{ margin: "24px 0 0", display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px" }}>
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label} style={{ display: "contents" }}>
            <dt style={{ opacity: 0.6 }}>{label}</dt>
            <dd style={{ margin: 0 }}>{value}</dd>
          </div>
        ))}
    </dl>
  );
}

// Layout "sidebar": modules listed in a coloured left column.
export function SidebarLayout({ data, template }: LayoutProps) {
  const side: CSSProperties = {
    background: template.theme.primary,
    padding: 24,
    color: "#fff",
  };
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <aside style={side}>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 24 }}>
          {data.tenant_name}
        </div>
        <nav style={{ display: "grid", gap: 8 }}>
          {template.modules.map((m) => (
            <div key={m.key} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.15)" }}>
              {m.label}
            </div>
          ))}
        </nav>
      </aside>
      <main style={{ padding: 32 }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>{data.message}</h1>
        <Details data={data} template={template} />
      </main>
    </div>
  );
}

// Layout "cards": coloured header, modules as a grid of cards.
export function CardsLayout({ data, template }: LayoutProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: template.theme.primary, color: "#fff", padding: "20px 32px", fontSize: "1.25rem", fontWeight: 700 }}>
        {data.tenant_name}
      </header>
      <main style={{ padding: 32 }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>{data.message}</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {template.modules.map((m) => (
            <div
              key={m.key}
              style={{ background: PANEL, borderLeft: `4px solid ${template.theme.primary}`, borderRadius: 8, padding: 20 }}
            >
              {m.label}
            </div>
          ))}
        </div>
        <Details data={data} template={template} />
      </main>
    </div>
  );
}

// Backend template "layout" name -> component. Add a new layout here and use
// its name in a template; nothing else in the frontend changes.
export const LAYOUTS: Record<string, (props: LayoutProps) => ReactElement> = {
  sidebar: SidebarLayout,
  cards: CardsLayout,
};
