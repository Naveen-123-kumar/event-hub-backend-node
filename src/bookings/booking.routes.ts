import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorization.middleware";
import { Permission } from "../modules/auth/auth.types";

import {
  createBookingController,
  getBookingByIdController,
  getMyBookingsController,
  cancelBookingController,
} from "./booking.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(Permission.BOOKING_CREATE),
  createBookingController,
);

router.get(
  "/me",
  authenticate,
  authorize(Permission.BOOKING_VIEW_OWN),
  getMyBookingsController,
);

router.get(
  "/:bookingId",
  authenticate,
  authorize(Permission.BOOKING_VIEW_OWN),
  getBookingByIdController,
);

router.patch(
  "/:bookingId/cancel",
  authenticate,
  authorize(Permission.BOOKING_CANCEL_OWN),
  cancelBookingController,
);

export default router;
