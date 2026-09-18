import { NextFunction, Request, Response } from "express";
import { UserRole } from "../modules/auth/auth.types";

export const requireOrganizationAccess = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Super Admin has platform-level access
  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  // Other organization-level users must belong to an organization
  if (!req.user.organizationId) {
    return res.status(403).json({
      success: false,
      message: "User is not associated with an organization",
    });
  }

  const { organizationId } = req.params;
  if (!organizationId) {
    return res.status(400).json({
      success: false,
      message: "Organization ID is required",
    });
  }

  if (req.user.organizationId.toString() !== organizationId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Access denied for this organization",
    });
  }
  next();
};
