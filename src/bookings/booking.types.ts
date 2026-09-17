export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface BookingItem {
  ticketId: string;
  ticketName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateBookingInput {
  eventId: string;

  items: {
    ticketId: string;
    quantity: number;
  }[];
}
