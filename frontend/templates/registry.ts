import type { ComponentType } from "react";
import { EducationSite } from "./education/EducationSite";
import { RestaurantSite } from "./restaurant/RestaurantSite";
import { TourSite } from "./tour/TourSite";
import type { TenantSiteProps } from "./types";

// Django supplies the published layout and palette for each catalog key.
export const renderers = new Map<string, { businessType: string; render: ComponentType<TenantSiteProps> }>([
  ["restaurant-classic", { businessType: "restau", render: RestaurantSite }],
  ["restaurant-dhaba", { businessType: "restau", render: RestaurantSite }],
  ["restaurant-bistro", { businessType: "restau", render: RestaurantSite }],
  ["restaurant-cafe", { businessType: "restau", render: RestaurantSite }],
  ["restaurant-night", { businessType: "restau", render: RestaurantSite }],
  ["education-classic", { businessType: "edu", render: EducationSite }],
  ["education-admissions", { businessType: "edu", render: EducationSite }],
  ["education-campus", { businessType: "edu", render: EducationSite }],
  ["education-learning", { businessType: "edu", render: EducationSite }],
  ["education-open-day", { businessType: "edu", render: EducationSite }],
  ["tour-explorer", { businessType: "tour", render: TourSite }],
  ["tour-adventure", { businessType: "tour", render: TourSite }],
  ["tour-heritage", { businessType: "tour", render: TourSite }],
  ["tour-escape", { businessType: "tour", render: TourSite }],
  ["tour-holidays", { businessType: "tour", render: TourSite }],
]);
