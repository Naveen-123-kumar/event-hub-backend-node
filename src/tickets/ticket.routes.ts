import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorization.middleware";
import { requireOrganizationAccess } from "../middleware/tenant.middleware";

import { Permission } from "../modules/auth/auth.types";

import {
  createTicketController,
  deleteTicketController,
  getEventTicketsController,
  getTicketController,
  updateTicketController,
} from "./ticket.controller";

const router = Router();
router.post(
  "/events/:eventId",
  authenticate,
  authorize(Permission.TICKET_CREATE),
  requireOrganizationAccess,
  createTicketController,
);
router.get(
  "/events/:eventId",
  authenticate,
  authorize(Permission.TICKET_VIEW),
  getEventTicketsController,
);
router.get(
  "/:ticketId",
  authenticate,
  authorize(Permission.TICKET_VIEW),
  requireOrganizationAccess,
  getTicketController,
);
router.patch(
  "/:ticketId",
  authenticate,
  authorize(Permission.TICKET_UPDATE),
  requireOrganizationAccess,
  updateTicketController,
);
router.delete(
  "/:ticketId",
  authenticate,
  authorize(Permission.TICKET_DELETE),
  requireOrganizationAccess,
  deleteTicketController,
);
export default router;
