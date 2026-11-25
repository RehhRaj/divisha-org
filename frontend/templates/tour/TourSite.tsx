import { BasicSite } from "../shared/BasicSite";
import { PackagesSection } from "./PackagesSection";
import type { TenantSiteProps } from "../types";

export function TourSite(props: TenantSiteProps) {
  const items = props.page.offerings ?? [];
  return <BasicSite {...props} section={items.length ? {
    title: "Packages", content: <PackagesSection items={items} />,
  } : undefined} />;
}
