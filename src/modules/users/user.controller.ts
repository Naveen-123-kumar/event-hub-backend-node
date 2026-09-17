import { Request, Response } from "express";
import {
  createOrganizationAdminSchema,
  getUsersQuerySchema,
  updateUserRoleSchema,
  updateUserSchema,
  updateUserStatusSchema,
  userIdSchema,
} from "./user.validation";

import {
  createOrganizationAdmin,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "./user.service";

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

export const getUsersController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const query = getUsersQuerySchema.parse(req.query);

    // const result = await getUsers(query, req.user);
    const result = await getUsers(query, {
      userId: req.user.id,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });

    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { userId } = userIdSchema.parse(req.params);

    // const user = await getUserById(userId, req.user);
    const user = await getUserById(userId, {
      userId: req.user.id,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { userId } = userIdSchema.parse(req.params);

    const data = updateUserSchema.parse(req.body);

    const user = await updateUser(userId, data);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
    });
  }
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { userId } = userIdSchema.parse(req.params);

    const data = updateUserRoleSchema.parse(req.body);

    const user = await updateUserRole(userId, data);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update user role",
    });
  }
};

export const updateUserStatusController = async (
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

    const { userId } = userIdSchema.parse(req.params);

    const data = updateUserStatusSchema.parse(req.body);

    const user = await updateUserStatus(userId, data);

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update user status",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { userId } = userIdSchema.parse(req.params);

    await deleteUser(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
};
