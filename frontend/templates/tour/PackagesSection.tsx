import { OfferingList } from "../shared/OfferingList";
import type { PublishedTenantSite } from "../types";

export function PackagesSection({ items }: { items: NonNullable<PublishedTenantSite["offerings"]> }) {
  return <OfferingList items={items} />;
}
