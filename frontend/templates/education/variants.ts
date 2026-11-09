import type { Family } from "../types";

export const education: Family = {
  label: "Education", mark: "✧", sectionId: "programmes", offeringLabel: "School programmes",
  contactTitle: "Ask about admissions", guidance: "Start with the class level you are interested in and prepare any questions about admissions or campus visits.",
  variants: {
    classic: { name: "Classic", headline: "Give curiosity room to grow.", label: "Learning at every stage", layout: "editorial" },
    admissions: { name: "Admissions", headline: "Find the next step in your child’s education.", label: "Admissions guide", layout: "catalog", color: "#245565", surface: "#dff0ef" },
    campus: { name: "Campus", headline: "See where a day of discovery begins.", label: "Life on campus", layout: "feature", color: "#443370", surface: "#ebe3f7" },
  },
};
