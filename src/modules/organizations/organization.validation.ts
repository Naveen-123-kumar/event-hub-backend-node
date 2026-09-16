import { z } from "zod";

import { OrganizationStatus } from "./organization.types";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name cannot exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can contain only lowercase letters, numbers and hyphens",
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  email: z.string().email("Invalid organization email").optional(),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),

  logo: z.string().url("Logo must be a valid URL").optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),

  description: z.string().trim().max(500).optional(),

  email: z.string().email("Invalid organization email").optional(),

  phone: z.string().trim().max(20).optional(),

  logo: z.string().url("Logo must be a valid URL").optional(),

  status: z
    .enum(
      Object.values(OrganizationStatus) as [
        OrganizationStatus,
        ...OrganizationStatus[],
      ],
    )
    .optional(),
});

export const organizationIdSchema = z.object({
  organizationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid organization ID"),
});
