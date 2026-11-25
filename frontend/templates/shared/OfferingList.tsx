import type { PublishedTenantSite } from "../types";

export function OfferingList({ items }: { items: NonNullable<PublishedTenantSite["offerings"]> }) {
  return (
    <ul>
      {items.map(({ name, detail }, index) => (
        <li key={`${index}-${name}`}>
          <strong>{name}</strong>{detail && <> · {detail}</>}
        </li>
      ))}
    </ul>
  );
}
