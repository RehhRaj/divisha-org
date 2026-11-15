import { TemplateView, type TemplateViewProps } from "./TemplateView";
import { RestaurantSite } from "./restaurant/RestaurantSite";

const renderers = new Map([["restaurant", RestaurantSite]]);

export function SiteRenderer(props: TemplateViewProps) {
  const Renderer = renderers.get(props.page.template) ?? TemplateView;
  return <Renderer {...props} />;
}
