export enum PaymentStatus {
  CREATED = "created",
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  OTHER = "other",
}

export enum WebhookStatus {
  PROCESSING = "processing",
  PROCESSED = "processed",
  FAILED = "failed",
}

/**
 * Create Razorpay payment order
 */
export interface CreatePaymentInput {
  bookingId: string;
}

/**
 * Data required to verify payment
 * after Razorpay Checkout.
 */
export interface VerifyPaymentInput {
  paymentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Response returned when a Razorpay
 * order is successfully created.
 */
export interface CreatePaymentResponse {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

/**
 * Razorpay webhook headers.
 */
export interface RazorpayWebhookHeaders {
  signature: string;
  eventId: string;
}

/**
 * Generic Razorpay webhook payload.
 */
export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: Record<string, unknown>;
  created_at: number;
}
