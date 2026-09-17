import { z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.string().min(1),

  items: z
    .array(
      z.object({
        ticketId: z.string().min(1),

        quantity: z.number().int().positive().max(20),
      }),
    )
    .min(1, "At least one ticket is required"),
});

export const bookingIdSchema = z.object({
  bookingId: z.string().min(1),
});
