import type { ContextResponse, TemplateData } from "@/lib/context";
import { CardsLayout, LAYOUTS } from "./layouts";

export default function TemplateView({ data, template }: { data: ContextResponse; template: TemplateData }) {
  const Layout = LAYOUTS[template.layout] ?? CardsLayout; // unknown layout -> safe default
  return <Layout data={data} template={template} />;
}
