import { Schema, model, Types } from "mongoose";

import { TicketStatus } from "./ticket.types";

export interface ITicket {
  eventId: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  saleStartDate: Date;
  saleEndDate: Date;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    saleStartDate: {
      type: Date,
      required: true,
    },

    saleEndDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.index({
  eventId: 1,
  status: 1,
});

ticketSchema.index({
  organizationId: 1,
  eventId: 1,
});

export const Ticket = model<ITicket>("Ticket", ticketSchema);
