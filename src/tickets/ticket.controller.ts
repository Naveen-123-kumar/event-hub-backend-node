import { Request, Response } from "express";
import {
  createTicket,
  deleteTicket,
  getEventTickets,
  getTicketById,
  updateTicket,
} from "./ticket.service";

import {
  createTicketSchema,
  eventIdSchema,
  ticketIdSchema,
  updateTicketSchema,
} from "./ticket.schema";

export const createTicketController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { eventId } = eventIdSchema.parse(req.params);
    const data = createTicketSchema.parse(req.body);
    const ticket = await createTicket(eventId, req.user.organizationId, data);

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create ticket",
    });
  }
};
export const getEventTicketsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { eventId } = eventIdSchema.parse(req.params);
    const tickets = await getEventTickets(eventId, req.user?.organizationId);
    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch tickets",
    });
  }
};
export const getTicketController = async (req: Request, res: Response) => {
  try {
    const { ticketId } = ticketIdSchema.parse(req.params);
    const ticket = await getTicketById(ticketId, req.user?.organizationId);
    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch ticket",
    });
  }
};
export const updateTicketController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { ticketId } = ticketIdSchema.parse(req.params);
    const data = updateTicketSchema.parse(req.body);
    const ticket = await updateTicket(ticketId, req.user.organizationId, data);
    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update ticket",
    });
  }
};
export const deleteTicketController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization access required",
      });
    }

    const { ticketId } = ticketIdSchema.parse(req.params);
    await deleteTicket(ticketId, req.user.organizationId);
    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete ticket",
    });
  }
};
