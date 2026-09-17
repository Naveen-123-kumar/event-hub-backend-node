import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { AccessTokenPayload } from "../../utils/jwt";
import { User } from "../auth/auth.model";
import { UserRole } from "../auth/auth.types";
import { Organization } from "../organizations/organization.model";

import {
  CreateOrganizationAdminInput,
  GetUsersQuery,
  UpdateUserInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
} from "./user.types";

export const createOrganizationAdmin = async (
  data: CreateOrganizationAdminInput,
) => {
  if (!Types.ObjectId.isValid(data.organizationId)) {
    throw new Error("Invalid organization ID");
  }

  const organization = await Organization.findOne({
    _id: new Types.ObjectId(data.organizationId),
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  if (organization.status !== "active") {
    throw new Error("Cannot create admin for an inactive organization");
  }

  const existingUser = await User.findOne({
    email: data.email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    email: data.email.toLowerCase(),
    password: hashedPassword,
    isEmailVerified: true,
    authProvider: "local",
    role: UserRole.ORGANIZATION_ADMIN,
    organizationId: new Types.ObjectId(data.organizationId),
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};

export const getUsers = async (
  query: GetUsersQuery,
  currentUser: AccessTokenPayload,
) => {
  const { page, limit, search, role, organizationId } = query;

  const filter: Record<string, unknown> = {};

  if (currentUser.role === UserRole.SUPER_ADMIN) {
    if (organizationId) {
      filter.organizationId = new Types.ObjectId(organizationId);
    }
  } else {
    if (!currentUser.organizationId) {
      throw new Error("User is not associated with an organization");
    }

    if (organizationId && organizationId !== currentUser.organizationId) {
      throw new Error("Access denied for this organization");
    }

    filter.organizationId = new Types.ObjectId(currentUser.organizationId);
  }

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -providerId")
      .populate("organizationId", "name slug status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (
  userId: string,
  currentUser: AccessTokenPayload,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const filter: Record<string, unknown> = {
    _id: new Types.ObjectId(userId),
  };

  if (currentUser.role !== UserRole.SUPER_ADMIN) {
    if (!currentUser.organizationId) {
      throw new Error("User is not associated with an organization");
    }

    filter.organizationId = new Types.ObjectId(currentUser.organizationId);
  }

  const user = await User.findOne(filter)
    .select("-password -providerId")
    .populate("organizationId", "name slug status");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (userId: string, data: UpdateUserInput) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
      _id: {
        $ne: new Types.ObjectId(userId),
      },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    data.email = data.email.toLowerCase();
  }

  if (data.organizationId) {
    if (!Types.ObjectId.isValid(data.organizationId)) {
      throw new Error("Invalid organization ID");
    }

    const organization = await Organization.findById(data.organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (organization.status !== "active") {
      throw new Error("Cannot assign user to an inactive organization");
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-password -providerId")
    .populate("organizationId", "name slug status");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserRole = async (
  userId: string,
  data: UpdateUserRoleInput,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (data.role === UserRole.SUPER_ADMIN) {
    throw new Error("Super Admin role cannot be assigned through this API");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: data.role,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-password -providerId")
    .populate("organizationId", "name slug status");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserStatus = async (
  userId: string,
  data: UpdateUserStatusInput,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isEmailVerified: data.isEmailVerified,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-password -providerId")
    .populate("organizationId", "name slug status");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const deleteUser = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
