import { Types } from "mongoose";

import { Organization } from "./organization.model";

import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  OrganizationStatus,
} from "./organization.types";

export const createOrganization = async (
  data: CreateOrganizationInput,
  userId: string,
) => {
  const existingOrganization = await Organization.findOne({
    slug: data.slug,
  });

  if (existingOrganization) {
    throw new Error("Organization with this slug already exists");
  }

  const organization = await Organization.create({
    ...data,
    createdBy: new Types.ObjectId(userId),
  });

  return organization;
};

export const getOrganizations = async () => {
  return Organization.find({
    status: {
      $in: [OrganizationStatus.ACTIVE, OrganizationStatus.INACTIVE],
    },
  })
    .populate("createdBy", "email role")
    .populate("updatedBy", "email role")
    .sort({
      createdAt: -1,
    });
};

export const getOrganizationById = async (organizationId: string) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  const organization = await Organization.findOne({
    _id: new Types.ObjectId(organizationId),
    status: {
      $in: [OrganizationStatus.ACTIVE, OrganizationStatus.INACTIVE],
    },
  })
    .populate("createdBy", "email role")
    .populate("updatedBy", "email role");

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
};

export const updateOrganization = async (
  organizationId: string,
  data: UpdateOrganizationInput,
  userId: string,
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  if (data.slug) {
    const existingOrganization = await Organization.findOne({
      slug: data.slug,
      _id: {
        $ne: new Types.ObjectId(organizationId),
      },
    });

    if (existingOrganization) {
      throw new Error("Organization with this slug already exists");
    }
  }

  const organization = await Organization.findOneAndUpdate(
    {
      _id: new Types.ObjectId(organizationId),
      status: {
        $in: [OrganizationStatus.ACTIVE, OrganizationStatus.INACTIVE],
      },
    },
    {
      $set: {
        ...data,
        updatedBy: new Types.ObjectId(userId),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
};

export const deleteOrganization = async (
  organizationId: string,
  userId: string,
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  const organization = await Organization.findOneAndUpdate(
    {
      _id: new Types.ObjectId(organizationId),
      status: OrganizationStatus.ACTIVE,
    },
    {
      $set: {
        status: OrganizationStatus.INACTIVE,
        updatedBy: new Types.ObjectId(userId),
      },
    },
    {
      new: true,
    },
  );

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
};
