import Stripe from "stripe";
import config from "../../../config";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
const stripe = new Stripe(config.stripeSecretKey as string);

const webhookSecret = config.stripeWebHookSecret as string;

const paymentService = {
  verifyWebhook(req:Request, sig: any) {
    return stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  },

  async handleCheckoutCompleted(session: any) {
    console.log("💰 Checkout Session Completed:", session.id);

    const paymentId = session.metadata?.paymentId
    const appointmentId = session.metadata?.appointmentId

    await prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
      }
    })
    await prisma.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        paymentGatewayData: session
      }
    })

    // Example: update order status in DB
    // await OrderModel.findOneAndUpdate({ sessionId: session.id }, { status: "PAID" });

    return true;
  },

  async handlePaymentSucceeded(paymentIntent: any) {
    console.log("✅ Payment Succeeded:", paymentIntent.id);

    // Example: update payment record
    // await PaymentModel.create({ paymentIntentId: paymentIntent.id, amount: paymentIntent.amount });

    return true;
  },
};

export default paymentService;
