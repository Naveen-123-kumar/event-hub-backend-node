import { Types } from "mongoose";

import { Event } from "../modules/events/event.model";
import { EventStatus } from "../modules/events/event.types";

import { Ticket } from "../tickets/ticket.model";
import { TicketStatus } from "../tickets/ticket.types";

import { Booking } from "./booking.model";
import {
  BookingStatus,
  PaymentStatus,
  CreateBookingInput,
} from "./booking.types";

export const createBooking = async (
  userId: string,
  input: CreateBookingInput,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(input.eventId)) {
    throw new Error("Invalid event ID");
  }

  if (!input.items || !input.items.length) {
    throw new Error("At least one ticket is required");
  }

  for (const item of input.items) {
    if (!Types.ObjectId.isValid(item.ticketId)) {
      throw new Error(`Invalid ticket ID: ${item.ticketId}`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid quantity for ticket: ${item.ticketId}`);
    }
  }

  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const eventId = new Types.ObjectId(input.eventId);
    const customerId = new Types.ObjectId(userId);

    const event = await Event.findOne({
      _id: eventId,
      status: EventStatus.PUBLISHED,
    }).session(session);

    if (!event) {
      throw new Error("Event not found or not published");
    }

    const now = new Date();

    if (now >= event.endDate) {
      throw new Error("Event has already ended");
    }

    const bookingItems: {
      ticketId: Types.ObjectId;
      ticketName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    let totalAmount = 0;

    for (const item of input.items) {
      const ticketId = new Types.ObjectId(item.ticketId);

      const reservedTicket = await Ticket.findOneAndUpdate(
        {
          _id: ticketId,
          eventId: event._id,
          organizationId: event.organizationId,
          status: TicketStatus.ACTIVE,
          saleStartDate: {
            $lte: now,
          },
          saleEndDate: {
            $gte: now,
          },
          availableQuantity: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            availableQuantity: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!reservedTicket) {
        throw new Error(
          `Ticket ${item.ticketId} is unavailable or insufficient quantity`,
        );
      }

      const itemTotal = reservedTicket.price * item.quantity;

      bookingItems.push({
        ticketId: reservedTicket._id,
        ticketName: reservedTicket.name,
        quantity: item.quantity,
        unitPrice: reservedTicket.price,
        totalPrice: itemTotal,
      });

      totalAmount += itemTotal;
    }

    const bookingNumber = `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const [booking] = await Booking.create(
      [
        {
          bookingNumber,
          userId: customerId,
          organizationId: event.organizationId,
          eventId: event._id,
          items: bookingItems,
          totalAmount,
          status: BookingStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          expiresAt,
        },
      ],
      {
        session,
      },
    );

    await session.commitTransaction();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getMyBookings = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const bookings = await Booking.find({
    userId: new Types.ObjectId(userId),
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return bookings;
};

export const getBookingById = async (bookingId: string, userId: string) => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking ID");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const booking = await Booking.findOne({
    _id: new Types.ObjectId(bookingId),
    userId: new Types.ObjectId(userId),
  }).lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const cancelBooking = async (bookingId: string, userId: string) => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking ID");
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const session = await Booking.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findOne({
      _id: new Types.ObjectId(bookingId),
      userId: new Types.ObjectId(userId),
    }).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error("Booking is already cancelled");
    }

    if (booking.status === BookingStatus.FAILED) {
      throw new Error("Failed booking cannot be cancelled");
    }

    if (booking.status === BookingStatus.EXPIRED) {
      throw new Error("Booking has already expired");
    }

    if (
      booking.status === BookingStatus.CONFIRMED &&
      booking.paymentStatus === PaymentStatus.SUCCESS
    ) {
      throw new Error("Confirmed paid booking requires a refund");
    }

    for (const item of booking.items) {
      const ticket = await Ticket.findOneAndUpdate(
        {
          _id: item.ticketId,
          eventId: booking.eventId,
        },
        {
          $inc: {
            availableQuantity: item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!ticket) {
        throw new Error(`Ticket not found: ${item.ticketId.toString()}`);
      }
    }

    booking.status = BookingStatus.CANCELLED;

    await booking.save({
      session,
    });

    await session.commitTransaction();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
