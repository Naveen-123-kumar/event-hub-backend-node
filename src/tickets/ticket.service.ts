import { Types } from "mongoose";

import { Event } from "../modules/events/event.model";
import { EventStatus } from "../modules/events/event.types";
import { Ticket } from "./ticket.model";
import {
  CreateTicketInput,
  TicketStatus,
  UpdateTicketInput,
} from "./ticket.types";

export const createTicket = async (
  eventId: string,
  organizationId: string,
  data: CreateTicketInput,
) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  const event = await Event.findOne({
    _id: eventId,
    organizationId,
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.status !== EventStatus.DRAFT) {
    throw new Error("Tickets can only be created for draft events");
  }

  if (data.saleEndDate > event.startDate) {
    throw new Error("Ticket sale must end before the event starts");
  }

  const ticket = await Ticket.create({
    eventId,
    organizationId,
    name: data.name,
    description: data.description,
    price: data.price,
    quantity: data.quantity,
    availableQuantity: data.quantity,
    saleStartDate: data.saleStartDate,
    saleEndDate: data.saleEndDate,
    status: TicketStatus.ACTIVE,
  });

  return ticket;
};
export const getEventTickets = async (
  eventId: string,
  organizationId?: string,
) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  const filter: Record<string, unknown> = {
    eventId,
  };

  if (organizationId) {
    filter.organizationId = organizationId;
  }

  return Ticket.find(filter).sort({ price: 1 }).lean();
};
export const getTicketById = async (
  ticketId: string,
  organizationId?: string,
) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID");
  }

  const filter: Record<string, unknown> = {
    _id: ticketId,
  };

  if (organizationId) {
    filter.organizationId = organizationId;
  }

  const ticket = await Ticket.findOne(filter).lean();

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  return ticket;
};
export const updateTicket = async (
  ticketId: string,
  organizationId: string,
  data: UpdateTicketInput,
) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID");
  }

  const ticket = await Ticket.findOne({
    _id: ticketId,
    organizationId,
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const soldQuantity = ticket.quantity - ticket.availableQuantity;
  if (data.quantity !== undefined && data.quantity < soldQuantity) {
    throw new Error(
      `Quantity cannot be less than sold quantity (${soldQuantity})`,
    );
  }

  if (
    data.saleStartDate &&
    data.saleEndDate &&
    data.saleEndDate <= data.saleStartDate
  ) {
    throw new Error("Sale end date must be after sale start date");
  }

  if (data.quantity !== undefined) {
    const newAvailableQuantity = data.quantity - soldQuantity;

    ticket.quantity = data.quantity;
    ticket.availableQuantity = newAvailableQuantity;
  }

  if (data.name !== undefined) {
    ticket.name = data.name;
  }

  if (data.description !== undefined) {
    ticket.description = data.description;
  }

  if (data.price !== undefined) {
    ticket.price = data.price;
  }

  if (data.saleStartDate !== undefined) {
    ticket.saleStartDate = data.saleStartDate;
  }

  if (data.saleEndDate !== undefined) {
    ticket.saleEndDate = data.saleEndDate;
  }

  await ticket.save();

  return ticket;
};
export const deleteTicket = async (
  ticketId: string,
  organizationId: string,
) => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw new Error("Invalid ticket ID");
  }

  const ticket = await Ticket.findOne({
    _id: ticketId,
    organizationId,
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const soldQuantity = ticket.quantity - ticket.availableQuantity;

  if (soldQuantity > 0) {
    throw new Error(
      "Ticket cannot be deleted because tickets have already been sold",
    );
  }

  await Ticket.deleteOne({
    _id: ticketId,
    organizationId,
  });

  return ticket;
};
