import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import paymentService from "./payment.service";

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = paymentService.verifyWebhook(req, sig);

    // Handle events
    switch (event.type) {
      case "checkout.session.completed":
        await paymentService.handleCheckoutCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        await paymentService.handlePaymentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: {},
    });
  } catch (err: any) {
    console.error("⚠️ Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
