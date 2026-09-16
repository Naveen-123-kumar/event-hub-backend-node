import { Document, model, Schema, Types } from "mongoose";

import { OrganizationStatus } from "./organization.types";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: string;

  status: OrganizationStatus;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(OrganizationStatus),
      default: OrganizationStatus.ACTIVE,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

organizationSchema.index({
  name: "text",
  description: "text",
});

export const Organization = model<IOrganization>(
  "Organization",
  organizationSchema,
);
