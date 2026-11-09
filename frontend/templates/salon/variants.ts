import type { Family } from "../types";

export const salon: Family = {
  label: "Beauty & Salon", mark: "❋", sectionId: "services", offeringLabel: "Salon services",
  contactTitle: "Ask about an appointment", guidance: "Choose a service and check its typical duration before asking the salon about an available appointment.",
  variants: {
    classic: { name: "Classic", headline: "Make time for a good hair day.", label: "Everyday care", layout: "editorial" },
    grooming: { name: "Grooming", headline: "Find your cut, style and finish.", label: "Grooming menu", layout: "catalog", color: "#304346", surface: "#e3eee9" },
    luxury: { name: "Luxury", headline: "Take an hour for yourself.", label: "Salon rituals", layout: "feature", color: "#71365a", surface: "#f5e4ec" },
  },
};
