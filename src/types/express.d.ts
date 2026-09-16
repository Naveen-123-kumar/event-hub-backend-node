import { UserRole } from "./modules/auth/auth.types";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      email: string;
      role: UserRole;
      organizationId?: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
