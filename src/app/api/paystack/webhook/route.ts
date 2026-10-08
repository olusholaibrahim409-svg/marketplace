import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured.");

      return NextResponse.json(
        { success: false, message: "Paystack is not configured." },
        { status: 500 }
      );
    }

    const body = await request.text();

    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Paystack signature." },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!signaturesMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid Paystack signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    console.log("PAYSTACK WEBHOOK EVENT:", event.event);

    if (event.event !== "charge.success") {
      return NextResponse.json({
        success: true,
        message: "Event received.",
      });
    }

    const transaction = event.data;

    const reference = transaction?.reference;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Payment reference is missing." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.error(
        "PAYSTACK WEBHOOK: Payment not found:",
        reference
      );

      return NextResponse.json(
        { success: false, message: "Payment not found." },
        { status: 404 }
      );
    }

    const expectedAmount = Math.round(
      Number(payment.amount) * 100
    );

    const paidAmount = Number(transaction.amount);

    if (paidAmount !== expectedAmount) {
      console.error("PAYSTACK WEBHOOK: Amount mismatch:", {
        reference,
        expectedAmount,
        paidAmount,
      });

      return NextResponse.json(
        { success: false, message: "Payment amount mismatch." },
        { status: 400 }
      );
    }

    if (payment.status === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment already processed.",
      });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "PAID",
          paidAt: new Date(),
          reference: transaction.reference,
        },
      }),

      prisma.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          status: "CONFIRMED",
        },
      }),
    ]);

    console.log(
      "PAYSTACK WEBHOOK: Payment confirmed:",
      reference
    );

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully.",
    });
  } catch (error) {
    console.error("PAYSTACK WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process Paystack webhook.",
      },
      { status: 500 }
    );
  }
}