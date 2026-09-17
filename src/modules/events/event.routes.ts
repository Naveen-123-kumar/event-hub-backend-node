import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorization.middleware";
import { requireOrganizationAccess } from "../../middleware/tenant.middleware";

import { Permission } from "../auth/auth.types";

import {
  createEventController,
  deleteEventController,
  getEventController,
  getEventsController,
  publishEventController,
  updateEventController,
} from "./event.controller";

const router = Router();
router.post(
  "/",
  authenticate,
  authorize(Permission.EVENT_CREATE),
  createEventController,
);
router.get(
  "/",
  authenticate,
  authorize(Permission.EVENT_VIEW),
  getEventsController,
);
router.get(
  "/:eventId",
  authenticate,
  authorize(Permission.EVENT_VIEW),
  requireOrganizationAccess,
  getEventController,
);
router.patch(
  "/:eventId",
  authenticate,
  authorize(Permission.EVENT_UPDATE),
  requireOrganizationAccess,
  updateEventController,
);
router.patch(
  "/:eventId/publish",
  authenticate,
  authorize(Permission.EVENT_PUBLISH),
  requireOrganizationAccess,
  publishEventController,
);
router.delete(
  "/:eventId",
  authenticate,
  authorize(Permission.EVENT_DELETE),
  requireOrganizationAccess,
  deleteEventController,
);
export default router;
