export enum OrganizationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: string;
  status?: OrganizationStatus;
}
