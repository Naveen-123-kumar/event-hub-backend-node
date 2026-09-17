import { z } from "zod";

import { UserRole } from "../auth/auth.types";

export const createOrganizationAdminSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  organizationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
});

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().optional(),

  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]).optional(),

  organizationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID")
    .optional(),
});

export const userIdSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export const updateUserSchema = z.object({
  email: z.string().trim().email("Invalid email address").optional(),

  organizationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID")
    .nullable()
    .optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
});

export const updateUserStatusSchema = z.object({
  isEmailVerified: z.boolean(),
});
