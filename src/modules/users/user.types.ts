import { UserRole } from "../auth/auth.types";

export interface CreateOrganizationAdminInput {
  email: string;
  password: string;
  organizationId: string;
}

export interface UpdateUserRoleInput {
  role: UserRole;
}
