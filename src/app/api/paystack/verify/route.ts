import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  try {
    // --------------------------------------------------
    // 1. CHECK LOGIN
    // --------------------------------------------------
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. CHECK CUSTOMER ROLE
    // --------------------------------------------------
    if (sessionUser.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only customer accounts can verify payments.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. GET PAYMENT REFERENCE
    // --------------------------------------------------
    const { searchParams } = new URL(request.url);

    const reference =
      searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment reference is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. PAYSTACK SECRET KEY
    // --------------------------------------------------
    const secretKey =
      process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error(
        "PAYSTACK_SECRET_KEY is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Paystack is not configured.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 5. FIND PAYMENT
    // --------------------------------------------------
    const payment =
      await prisma.payment.findFirst({
        where: {
          reference,

          Order: {
            userId:
              sessionUser.userId,
          },
        },

        include: {
          Order: true,
        },
      });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment record not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 6. VERIFY WITH PAYSTACK
    // --------------------------------------------------
    const paystackResponse =
      await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(
          reference
        )}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${secretKey}`,

            "Content-Type":
              "application/json",
          },

          cache: "no-store",
        }
      );

    const paystackData =
      await paystackResponse.json();

    console.log(
      "PAYSTACK VERIFY RESPONSE:",
      paystackData
    );

    // --------------------------------------------------
    // 7. CHECK PAYSTACK RESPONSE
    // --------------------------------------------------
    if (
      !paystackResponse.ok ||
      !paystackData.status
    ) {
      console.error(
        "PAYSTACK VERIFY ERROR:",
        paystackData
      );

      return NextResponse.json(
        {
          success: false,

          message:
            paystackData.message ||
            "Unable to verify Paystack payment.",
        },

        {
          status:
            paystackResponse.status ||
            400,
        }
      );
    }

    const transaction =
      paystackData.data;

    // --------------------------------------------------
    // 8. CHECK TRANSACTION STATUS
    // --------------------------------------------------
    if (
      transaction.status !==
      "success"
    ) {
      console.error(
        "PAYSTACK PAYMENT NOT SUCCESSFUL:",
        {
          reference,
          status:
            transaction.status,
        }
      );

      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: false,
          paid: false,

          message:
            "Payment was not successful.",

          status:
            transaction.status,
        },

        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 9. VERIFY AMOUNT
    // --------------------------------------------------
    const expectedAmount =
      Math.round(
        Number(payment.amount) * 100
      );

    const paidAmount =
      Number(transaction.amount);

    if (
      paidAmount !==
      expectedAmount
    ) {
      console.error(
        "PAYSTACK AMOUNT MISMATCH:",
        {
          expectedAmount,
          paidAmount,
          reference,
        }
      );

      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: false,
          paid: false,

          message:
            "Payment amount could not be verified.",
        },

        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 10. VERIFY CURRENCY
    // --------------------------------------------------
    if (
      transaction.currency &&
      transaction.currency !==
        "NGN"
    ) {
      console.error(
        "PAYSTACK CURRENCY MISMATCH:",
        {
          expected: "NGN",
          received:
            transaction.currency,
          reference,
        }
      );

      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: false,
          paid: false,

          message:
            "Payment currency could not be verified.",
        },

        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 11. PAYMENT SUCCESS
    // --------------------------------------------------
    // IMPORTANT:
    // Your PaymentStatus enum uses PAID,
    // NOT SUCCESS.
    // --------------------------------------------------
    const now = new Date();

    await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status: "PAID",

          paidAt: now,

          reference:
            transaction.reference,

          updatedAt: now,
        },
      }),

      prisma.order.update({
        where: {
          id: payment.orderId,
        },

        data: {
          status: "CONFIRMED",
          updatedAt: now,
        },
      }),
    ]);

    // --------------------------------------------------
    // 12. SUCCESS RESPONSE
    // --------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        paid: true,

        orderId:
          payment.orderId,

        orderNumber:
          payment.Order.orderNumber,

        reference:
          transaction.reference,

        message:
          "Payment verified successfully.",
      },

      { status: 200 }
    );
  } catch (error) {
    console.error(
      "PAYSTACK VERIFY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to verify payment.",
      },

      { status: 500 }
    );
  }
}