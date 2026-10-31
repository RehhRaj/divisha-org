type Props = {
  data: {
    business_type: string | null;
    title: string;
    message: string;
    template: string;
  };
};

export default function DemoPage({ data }: Props) {

  return (
    <main style={{ padding: 40 }}>

      <h1>{data.title}</h1>

      <p>{data.message}</p>

      <h2>Business Type Demo</h2>

      <p>Business Type: {data.business_type}</p>

      <p>Template: {data.template}</p>

    </main>
  );
}
