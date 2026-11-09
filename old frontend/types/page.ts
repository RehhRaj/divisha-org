
export type PageType =
  | "platform"
  | "demo"
  | "tenant"
  | "nested_tenant";

export type PageData = {
  page_type: PageType;
  business_type: string | null;
  tenant: string | null;
  parent_tenant: string | null;
  title: string;
  message: string;
  template: string | null;
};
