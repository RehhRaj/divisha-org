import type { Family } from "../types";

export const society: Family = {
  label: "Housing Society", mark: "▥", sectionId: "services", offeringLabel: "Resident services",
  contactTitle: "Reach the society office", guidance: "For maintenance, note the location and what needs attention. For community updates, start with society notices.",
  variants: {
    classic: { name: "Classic", headline: "A clearer way to find resident services.", label: "Your community", layout: "editorial" },
    "resident-portal": { name: "Resident Portal", headline: "Find the service you need today.", label: "Resident helpdesk", layout: "catalog", color: "#235450", surface: "#e1efe7" },
    "premium-community": { name: "Premium Community", headline: "A neighbourhood worth coming home to.", label: "Community living", layout: "feature", color: "#3c435d", surface: "#e8e7f0" },
  },
};
