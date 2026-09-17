import { Request, Response } from "express";

import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  publishEvent,
  updateEvent,
} from "./event.service";

import {
  createEventSchema,
  eventIdSchema,
  updateEventSchema,
} from "./event.schema";
export const createEventController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!req.user.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const data = createEventSchema.parse(req.body);

    const event = await createEvent(data, req.user.organizationId, req.user.id);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create event",
    });
  }
};

export const getEventsController = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user?.organizationId;

    const events = await getEvents(organizationId);

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch events",
    });
  }
};

export const getEventController = async (req: Request, res: Response) => {
  try {
    const { eventId } = eventIdSchema.parse(req.params);

    const event = await getEventById(eventId, req.user?.organizationId);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch event",
    });
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { eventId } = eventIdSchema.parse(req.params);

    const data = updateEventSchema.parse(req.body);

    const event = await updateEvent(eventId, data, req.user.organizationId);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update event",
    });
  }
};

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { eventId } = eventIdSchema.parse(req.params);

    await deleteEvent(eventId, req.user.organizationId);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete event",
    });
  }
};

export const publishEventController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { eventId } = eventIdSchema.parse(req.params);

    const event = await publishEvent(eventId, req.user.organizationId);

    return res.status(200).json({
      success: true,
      message: "Event published successfully",
      data: event,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to publish event",
    });
  }
};
