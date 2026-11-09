import type { Family } from "../types";

export const tour: Family = {
  label: "Tour & Travel", mark: "↗", sectionId: "destinations", offeringLabel: "Tour packages",
  contactTitle: "Plan your next journey", guidance: "Choose a route, check what is included and note the dates and group size you have in mind.",
  variants: {
    classic: { name: "Classic", headline: "Good trips begin with a good plan.", label: "Curated journeys", layout: "editorial" },
    adventure: { name: "Adventure", headline: "Take the road a little further.", label: "Outdoor escapes", layout: "catalog", color: "#924019", surface: "#f8e5cd" },
    luxury: { name: "Luxury", headline: "The pleasure of travelling slowly.", label: "Private escapes", layout: "feature", color: "#342c46", surface: "#eee5ec" },
  },
};
