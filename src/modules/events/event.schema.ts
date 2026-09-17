import { z } from "zod";

const eventFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),

  venue: z.string().trim().min(2, "Venue is required").max(300),

  city: z.string().trim().min(2, "City is required").max(100),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  capacity: z.number().int().positive("Capacity must be greater than zero"),
};

//Create Event

export const createEventSchema = z
  .object(eventFields)
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

//Update Event

export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .refine(
    (data) => {
      // Validate dates only when both are provided
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }

      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

//Event ID

export const eventIdSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});
