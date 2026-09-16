import { z } from "zod";

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
