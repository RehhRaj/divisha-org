import type { ContextResponse } from "@/lib/context";

// Used where no template applies: platform, business type default view,
// unknown host, pending/suspended tenant, backend error.
export default function MessageView({ data }: { data: ContextResponse }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>{data.message}</h1>
        <p style={{ opacity: 0.7, marginTop: 16 }}>
          host: {data.host} · level: {data.level}
          {data.status ? ` · status: ${data.status}` : ""}
        </p>
      </div>
    </main>
  );
}
