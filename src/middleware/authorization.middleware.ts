import { Request, Response, NextFunction } from "express";

import { ROLE_PERMISSIONS } from "../constants/authorization";
import { Permission, UserRole } from "../modules/auth/auth.types";

export const authorize = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    // const userPermissions = ROLE_PERMISSIONS[req.user.role];
    const userRole: UserRole = req.user.role;

    const userPermissions = ROLE_PERMISSIONS[userRole];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });

      return;
    }

    next();
  };
};
