import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPageData } from "@/lib/page-data";
import styles from "@/templates/TemplateView.module.css";

type Workflow = {
  title: string;
  intro: string;
  example: string;
  steps: [string, string][];
};

export default async function WorkflowPage({ params }: { params: Promise<{ demo: string }> }) {
  const { demo } = await params;
  const workflow = await fetchPageData<Workflow>({ demo });
  if (!workflow || !Array.isArray(workflow.steps)) notFound();
  return (
    <main className={`${styles.wrap} ${styles.details}`}>
      <Link href="/">← Divisha home</Link>
      <h1>{workflow.title}</h1>
      <p>{workflow.intro}</p>
      <h2>{workflow.example}</h2>
      <ol>
        {workflow.steps.map(([step, description]) => (
          <li key={step}><strong>{step}</strong><p>{description}</p></li>
        ))}
      </ol>
    </main>
  );
}
