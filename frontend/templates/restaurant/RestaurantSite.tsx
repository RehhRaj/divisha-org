import { TemplateView, type TemplateViewProps } from "../TemplateView";
import { AddToOrder, OrderCart, RestaurantOrder } from "./RestaurantOrder";

export function RestaurantSite(props: TemplateViewProps) {
  const { page } = props;
  const ordering = page.ordering;
  if (ordering?.mode === "invalid-table") {
    return <TemplateView {...props} orderPanel={<p role="status">Invalid table. Scan your table QR again.</p>} />;
  }
  if (page.page_type !== "tenant" || !page.site_id || !ordering?.whatsapp_number) {
    return <TemplateView {...props} />;
  }

  const table = ordering.table;
  return (
    <RestaurantOrder
      key={JSON.stringify([page.site_id, table?.id])}
      siteId={page.site_id}
      title={page.title}
      currency={page.currency}
      phone={ordering.whatsapp_number}
      table={table}
      menu={page.items}
    >
      <TemplateView
        {...props}
        itemAction={(offering) => <AddToOrder id={offering.id} />}
        orderPanel={<OrderCart />}
      />
    </RestaurantOrder>
  );
}
