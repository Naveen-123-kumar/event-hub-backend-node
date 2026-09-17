import { Types } from "mongoose";

import { Event } from "./event.model";
import { CreateEventInput, EventStatus, UpdateEventInput } from "./event.types";

export const createEvent = async (
  data: CreateEventInput,
  organizationId: string,
  createdBy: string,
) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  if (!Types.ObjectId.isValid(createdBy)) {
    throw new Error("Invalid user ID");
  }

  const event = await Event.create({
    ...data,
    organizationId,
    createdBy,
    status: EventStatus.DRAFT,
    registeredCount: 0,
  });

  return event;
};
export const getEvents = async (organizationId?: string) => {
  const filter = organizationId ? { organizationId } : {};

  return Event.find(filter).sort({ startDate: 1 }).lean();
};

export const getEventById = async (
  eventId: string,
  organizationId?: string,
) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  const filter: Record<string, unknown> = {
    _id: eventId,
  };

  if (organizationId) {
    filter.organizationId = organizationId;
  }

  const event = await Event.findOne(filter).lean();

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const updateEvent = async (
  eventId: string,
  data: UpdateEventInput,
  organizationId: string,
) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      organizationId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const deleteEvent = async (eventId: string, organizationId: string) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await Event.findOneAndDelete({
    _id: eventId,
    organizationId,
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};
export const publishEvent = async (eventId: string, organizationId: string) => {
  if (!Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid event ID");
  }

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      organizationId,
      status: EventStatus.DRAFT,
    },
    {
      $set: {
        status: EventStatus.PUBLISHED,
      },
    },
    {
      new: true,
    },
  );

  if (!event) {
    throw new Error("Event not found or event cannot be published");
  }

  return event;
};
