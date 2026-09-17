import { Schema, model, Types, HydratedDocument } from "mongoose";
import { EventStatus } from "./event.types";

export interface IEvent {
  title: string;
  description?: string;

  organizationId: Types.ObjectId;
  createdBy: Types.ObjectId;

  venue: string;
  city: string;

  startDate: Date;
  endDate: Date;

  capacity: number;
  registeredCount: number;

  status: EventStatus;

  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.index({
  organizationId: 1,
  status: 1,
});

eventSchema.index({
  organizationId: 1,
  startDate: 1,
});

export const Event = model<IEvent>("Event", eventSchema);
