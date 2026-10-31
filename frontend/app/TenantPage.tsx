type Props = {
  data: {
    page_type: string;
    business_type: string | null;
    tenant: string | null;
    parent_tenant: string | null;
    title: string;
    message: string;
    template: string;
  };
};

export default function TenantPage({ data }: Props) {
  return (
    <main style={{ padding: 40 }}>

      <h1>{data.title}</h1>

      <p>{data.message}</p>

      <h2>Tenant Website</h2>

      <p>
        <strong>Tenant:</strong> {data.tenant}
      </p>

      <p>
        <strong>Business Type:</strong> {data.business_type}
      </p>

      <p>
        <strong>Parent Tenant:</strong>{" "}
        {data.parent_tenant ?? "None"}
      </p>

      <p>
        <strong>Template:</strong> {data.template}
      </p>

    </main>
  );
}