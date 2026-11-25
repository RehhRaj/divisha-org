import { renderers } from "./registry";
import { BasicSite } from "./shared/BasicSite";
import type { TenantSiteProps } from "./types";

export function TenantSite(props: TenantSiteProps) {
  const entry = renderers.get(props.page.template);
  const Renderer = entry?.businessType === props.page.business_type ? entry.render : BasicSite;
  return <Renderer {...props} />;
}
