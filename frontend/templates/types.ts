export interface PublishedTenantSite {
  title: string;
  description: string;
  template: string;
  business_type: string;
  presentation?: { layout: string; palette: string } | null;
  offerings?: { name: string; detail: string }[];
  hours?: string;
  contact?: string;
}

export interface TenantSiteProps {
  page: PublishedTenantSite;
  loginUrl: string;
}
