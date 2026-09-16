import { UserRole } from "../modules/auth/auth.types";
export interface AuthUser {
  id: string;

  email: string;

  role: UserRole;

  organizationId?: string;
}
