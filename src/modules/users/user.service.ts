import bcrypt from "bcrypt";
import { Types } from "mongoose";

import { User } from "../auth/auth.model";
import { UserRole } from "../auth/auth.types";
import { Organization } from "../organizations/organization.model";

import { CreateOrganizationAdminInput } from "./user.types";

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
