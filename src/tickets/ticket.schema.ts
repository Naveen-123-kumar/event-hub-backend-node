import { z } from "zod";

export const eventIdSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export const ticketIdSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
});

export const createTicketSchema = z
  .object({
    name: z.string().trim().min(2, "Ticket name is required").max(150),

    description: z.string().trim().max(1000).optional(),

    price: z.number().min(0, "Price cannot be negative"),

    quantity: z.number().int().positive("Quantity must be greater than zero"),

    saleStartDate: z.coerce.date(),

    saleEndDate: z.coerce.date(),
  })
  .refine((data) => data.saleEndDate > data.saleStartDate, {
    message: "Sale end date must be after sale start date",
    path: ["saleEndDate"],
  });

export const updateTicketSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),

    description: z.string().trim().max(1000).optional(),

    price: z.number().min(0).optional(),

    quantity: z.number().int().positive().optional(),

    saleStartDate: z.coerce.date().optional(),

    saleEndDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.saleStartDate && data.saleEndDate) {
        return data.saleEndDate > data.saleStartDate;
      }

      return true;
    },
    {
      message: "Sale end date must be after sale start date",
      path: ["saleEndDate"],
    },
  );
