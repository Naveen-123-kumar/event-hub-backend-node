import razorpay from "../integrations/razorpay/razorpay.client";
import { Payment } from "./payment.model";
import { PaymentStatus } from "./payment.types";

interface CreatePaymentInput {
  bookingId: string;
  amount: number;
  currency?: string;
}

export const createPaymentOrder = async ({
  bookingId,
  amount,
  currency = "INR",
}: CreatePaymentInput) => {
  const existingPayment = await Payment.findOne({
    where: {
      bookingId,
      status: PaymentStatus.CREATED,
    },
  });

  if (existingPayment) {
    return {
      paymentId: existingPayment.id,
      razorpayOrderId: existingPayment.razorpayOrderId,
      amount: existingPayment.amount,
      currency: existingPayment.currency,
    };
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: `booking_${bookingId}`,
  });

  const payment = await Payment.create({
    bookingId,
    razorpayOrderId: razorpayOrder.id,
    amount,
    currency,
    status: PaymentStatus.CREATED,
  });

  return {
    paymentId: payment.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};
