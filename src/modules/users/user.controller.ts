import { Request, Response } from "express";

import { createOrganizationAdminSchema } from "./user.validation";

import { createOrganizationAdmin } from "./user.service";

export const createOrganizationAdminController = async (
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

    const data = createOrganizationAdminSchema.parse(req.body);

    const user = await createOrganizationAdmin(data);

    return res.status(201).json({
      success: true,
      message: "Organization Admin created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create Organization Admin",
    });
  }
};
