type Props = {
  data: {
    tenant: string | null;
    business_type: string | null;
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

      <hr />

      <h2>Tenant Website</h2>

      <p>Tenant: {data.tenant}</p>

      <p>Business Type: {data.business_type}</p>

      <p>Template: {data.template}</p>

    </main>
  );
}
