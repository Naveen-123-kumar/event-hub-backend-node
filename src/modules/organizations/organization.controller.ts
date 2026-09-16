import { Request, Response } from "express";

import {
  createOrganizationSchema,
  organizationIdSchema,
  updateOrganizationSchema,
} from "./organization.validation";

import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizations,
  updateOrganization,
} from "./organization.service";

export const createOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = createOrganizationSchema.parse(req.body);

    const organization = await createOrganization(data, req.user.id);

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: organization,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create organization",
    });
  }
};

export const getOrganizationsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const organizations = await getOrganizations();

    return res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch organizations",
    });
  }
};

export const getOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { organizationId } = organizationIdSchema.parse(req.params);

    const organization = await getOrganizationById(organizationId);

    return res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch organization",
    });
  }
};

export const updateOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { organizationId } = organizationIdSchema.parse(req.params);

    const data = updateOrganizationSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const organization = await updateOrganization(
      organizationId,
      data,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update organization",
    });
  }
};

export const deleteOrganizationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { organizationId } = organizationIdSchema.parse(req.params);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await deleteOrganization(organizationId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
    });
  }
};
