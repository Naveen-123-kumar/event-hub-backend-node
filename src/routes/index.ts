import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organizations/organization.routes";
import userRoutes from "../modules/users/user.routes";
import eventRoutes from "../modules/events/event.routes";
import ticketRoutes from "../tickets/ticket.routes";
import bookingRoutes from "../bookings/booking.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});
//Auth
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);
router.use("/api/events", eventRoutes);
router.use("/api/tickets", ticketRoutes);
router.use("/api/bookings", bookingRoutes);

export default router;
