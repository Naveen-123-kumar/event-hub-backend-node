import { UserRole } from "../auth/auth.types";

export interface CreateOrganizationAdminInput {
  email: string;
  password: string;
  organizationId: string;
}

export interface GetUsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  organizationId?: string;
}

export interface UpdateUserInput {
  email?: string;
  organizationId?: string | null;
}

export interface UpdateUserRoleInput {
  role: UserRole;
}

export interface UpdateUserStatusInput {
  isEmailVerified?: boolean;
}
