import type { Family } from "../types";

export const restaurant: Family = {
  label: "Restaurant", mark: "✺", sectionId: "menu", offeringLabel: "From the menu",
  contactTitle: "Plan a visit", guidance: "Explore the menu before you visit. For a group meal, check seating and dietary needs with the restaurant.",
  variants: {
    classic: { name: "Classic", headline: "Good food brings everyone to the table.", label: "Made for sharing", layout: "editorial" },
    dhaba: { name: "Dhaba", headline: "Tandoor favourites and hearty plates.", label: "Roadside favourites", layout: "catalog", color: "#893915", surface: "#fae1b8" },
    "fine-dining": { name: "Fine Dining", headline: "Make an evening of dinner.", label: "Around the table", layout: "feature", color: "#513025", surface: "#f1e6d9" },
  },
};
