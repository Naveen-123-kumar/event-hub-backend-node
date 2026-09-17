import { Payment } from "./payment.model";
import { PaymentStatus } from "./payment.types";

export class PaymentRepository {
  /**
   * Create a new payment record
   */
  async createPayment(data: {
    bookingId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    status?: PaymentStatus;
  }): Promise<Payment> {
    return Payment.create({
      bookingId: data.bookingId,
      razorpayOrderId: data.razorpayOrderId,
      amount: data.amount,
      currency: data.currency,
      status: data.status ?? PaymentStatus.CREATED,
    });
  }

  /**
   * Find payment by internal payment ID
   */
  async findById(paymentId: string): Promise<Payment | null> {
    return Payment.findByPk(paymentId);
  }

  /**
   * Find payment by booking ID
   */
  async findByBookingId(bookingId: string): Promise<Payment | null> {
    return Payment.findOne({
      where: {
        bookingId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Find payment by Razorpay order ID
   */
  async findByRazorpayOrderId(
    razorpayOrderId: string,
  ): Promise<Payment | null> {
    return Payment.findOne({
      where: {
        razorpayOrderId,
      },
    });
  }

  /**
   * Find payment by Razorpay payment ID
   */
  async findByRazorpayPaymentId(
    razorpayPaymentId: string,
  ): Promise<Payment | null> {
    return Payment.findOne({
      where: {
        razorpayPaymentId,
      },
    });
  }

  /**
   * Update payment after successful verification
   */
  async markAsSuccess(
    paymentId: string,
    razorpayPaymentId: string,
    paymentMethod?: Payment["paymentMethod"],
    gatewayResponse?: Record<string, unknown>,
  ): Promise<[number, Payment[]]> {
    return Payment.update(
      {
        razorpayPaymentId,
        paymentMethod,
        gatewayResponse,
        status: PaymentStatus.SUCCESS,
        paidAt: new Date(),
        failureReason: null,
      },
      {
        where: {
          id: paymentId,
        },
        returning: true,
      },
    );
  }

  /**
   * Mark payment as failed
   */
  async markAsFailed(
    paymentId: string,
    failureReason: string,
    gatewayResponse?: Record<string, unknown>,
  ): Promise<[number, Payment[]]> {
    return Payment.update(
      {
        status: PaymentStatus.FAILED,
        failureReason,
        gatewayResponse,
      },
      {
        where: {
          id: paymentId,
        },
        returning: true,
      },
    );
  }

  /**
   * Mark payment as cancelled
   */
  async markAsCancelled(paymentId: string): Promise<[number, Payment[]]> {
    return Payment.update(
      {
        status: PaymentStatus.CANCELLED,
      },
      {
        where: {
          id: paymentId,
        },
        returning: true,
      },
    );
  }

  /**
   * Mark payment as refunded
   */
  async markAsRefunded(
    paymentId: string,
    refundedAt: Date = new Date(),
  ): Promise<[number, Payment[]]> {
    return Payment.update(
      {
        status: PaymentStatus.REFUNDED,
        refundedAt,
      },
      {
        where: {
          id: paymentId,
        },
        returning: true,
      },
    );
  }

  /**
   * Check whether a successful payment already exists for a booking
   */
  async hasSuccessfulPayment(bookingId: string): Promise<boolean> {
    const payment = await Payment.findOne({
      where: {
        bookingId,
        status: PaymentStatus.SUCCESS,
      },
    });

    return Boolean(payment);
  }

  /**
   * Find an existing active payment for a booking
   *
   * Useful for preventing multiple Pay Now clicks
   * from creating multiple Razorpay orders.
   */
  async findActivePayment(bookingId: string): Promise<Payment | null> {
    return Payment.findOne({
      where: {
        bookingId,
        status: [PaymentStatus.CREATED, PaymentStatus.PENDING],
      },
      order: [["createdAt", "DESC"]],
    });
  }
}

export const paymentRepository = new PaymentRepository();
