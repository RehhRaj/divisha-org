export type CTA = { text: string; link: string; open_in_new_tab?: boolean };

export type Offering = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price?: number | null;
  discount_price?: number | null;
  price_unit?: string | null;
  price_is_from?: boolean;
  duration_label?: string;
  image_url?: string | null;
  image_alt?: string;
  inclusions?: string[];
  cta?: CTA;
};

export type SitePage = {
  page_type: "demo" | "tenant";
  business_type: string;
  tenant: string | null;
  template: string;
  template_variant: string;
  available_variants: string[];
  title: string;
  message: string;
  currency: string;
  theme: { primary_color: string; secondary_color: string };
  content: { tagline: string; about_us: string; items_disclaimer: string; primary_cta: CTA; secondary_cta: CTA };
  sections: { show_items: boolean; show_why_us: boolean };
  navigation: { header_links: { label: string; href: string }[] };
  contact: { phone: string | null; whatsapp: string | null; email: string | null; address: string | null };
  items: Offering[];
  seo: { meta_title: string; meta_description: string };
  faqs: { question: string; answer: string }[];
};

export type Variant = {
  name: string;
  headline: string;
  label: string;
  layout: "editorial" | "catalog" | "feature";
  color?: string;
  surface?: string;
};

export type Family = {
  label: string;
  mark: string;
  sectionId: string;
  offeringLabel: string;
  contactTitle: string;
  guidance: string;
  variants: Record<string, Variant>;
};
