
import type { PageData } from "@/types/page";
import TemplateRenderer from "@/templates/TemplateRenderer";

export default function TenantPage({
  data,
}: {
  data: PageData;
}) {
  return <TemplateRenderer data={data} />;
}
