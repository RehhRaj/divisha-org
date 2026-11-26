import { BasicSite } from "../shared/BasicSite";
import { OfferingList } from "../shared/OfferingList";
import type { TenantSiteProps } from "../types";

export function EducationSite(props: TenantSiteProps) {
  const items = props.page.offerings ?? [];
  return <BasicSite {...props} section={items.length ? {
    title: "Programmes", content: <OfferingList items={items} />,
  } : undefined} />;
}
