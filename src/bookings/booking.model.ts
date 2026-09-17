import { Schema, model, Types, HydratedDocument } from "mongoose";
import { BookingStatus, PaymentStatus } from "./booking.types";

const bookingItemSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    ticketName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

export interface IBooking {
  bookingNumber: string;

  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  eventId: Types.ObjectId;

  items: {
    ticketId: Types.ObjectId;
    ticketName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];

  totalAmount: number;

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  /**
   * Payment transaction created in MySQL.
   * MongoDB only keeps the reference.
   */
  paymentTransactionId?: string;

  /**
   * Time until which the pending booking
   * keeps the ticket inventory reserved.
   */
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    items: {
      type: [bookingItemSchema],
      required: true,

      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Booking must contain at least one ticket",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },

    paymentTransactionId: {
      type: String,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

bookingSchema.index({
  userId: 1,
  createdAt: -1,
});

bookingSchema.index({
  eventId: 1,
  status: 1,
});

bookingSchema.index({
  organizationId: 1,
  createdAt: -1,
});

bookingSchema.index({
  status: 1,
  expiresAt: 1,
});

export const Booking = model<IBooking>("Booking", bookingSchema);
