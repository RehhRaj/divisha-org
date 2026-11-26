import { BasicSite } from "../shared/BasicSite";
import { MenuSection } from "./MenuSection";
import type { TenantSiteProps } from "../types";

export function RestaurantSite(props: TenantSiteProps) {
  const items = props.page.offerings ?? [];
  return <BasicSite {...props} section={items.length ? {
    title: "Menu", content: <MenuSection items={items} />,
  } : undefined} />;
}
