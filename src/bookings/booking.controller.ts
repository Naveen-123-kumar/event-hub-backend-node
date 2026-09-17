import { Request, Response } from "express";
import {
  createBooking,
  getBookingById,
  getMyBookings,
  cancelBooking,
} from "./booking.service";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const booking = await createBooking(userId, req.body);

    return res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create booking",
    });
  }
};

export const getMyBookingsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const bookings = await getMyBookings(userId);

    return res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch bookings",
    });
  }
};

export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { bookingId } = req.params;

    if (typeof bookingId !== "string") {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await getBookingById(bookingId, userId);

    return res.status(200).json({
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch booking",
    });
  }
};

export const cancelBookingController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { bookingId } = req.params;

    if (typeof bookingId !== "string") {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await getBookingById(bookingId, userId);
    return res.status(200).json({
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to cancel booking",
    });
  }
};
