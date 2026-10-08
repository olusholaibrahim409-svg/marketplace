import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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
            "Only customer accounts can make payments.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. READ REQUEST
    // --------------------------------------------------
    const body = await request.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. GET ORDER
    // --------------------------------------------------
    // IMPORTANT:
    // Your Prisma relations are:
    //
    // User
    // Payment
    //
    // NOT:
    //
    // user
    // payment
    // --------------------------------------------------
    const order =
      await prisma.order.findFirst({
        where: {
          id: orderId,

          userId:
            sessionUser.userId,
        },

        include: {
          User: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },

          Payment: true,
        },
      });

    // --------------------------------------------------
    // 5. CHECK ORDER
    // --------------------------------------------------
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 6. CHECK PAYMENT RECORD
    // --------------------------------------------------
    const payment =
      order.Payment;

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment record was not found for this order.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 7. CHECK PAYMENT METHOD
    // --------------------------------------------------
    if (
      payment.method !==
      "PAYSTACK"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order is not configured for Paystack.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 8. CHECK PAYMENT STATUS
    // --------------------------------------------------
    if (
      payment.status ===
      "PAID"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has already been paid.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 9. GET PAYSTACK SECRET KEY
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
    // 10. PAYMENT REFERENCE
    // --------------------------------------------------
    const reference =
      payment.reference ||
      `PAY-${order.orderNumber}-${Date.now()}`;

    // --------------------------------------------------
    // 11. CONVERT NAIRA TO KOBO
    // --------------------------------------------------
    const amountInKobo =
      Math.round(
        Number(order.total) * 100
      );

    // --------------------------------------------------
    // 12. CALLBACK URL
    // --------------------------------------------------
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const callbackUrl =
      `${appUrl}/checkout/paystack/callback` +
      `?reference=${encodeURIComponent(
        reference
      )}`;

    // --------------------------------------------------
    // 13. CUSTOMER NAME
    // --------------------------------------------------
    const customerName =
      `${order.User?.firstName || ""} ${
        order.User?.lastName || ""
      }`.trim();

    // --------------------------------------------------
    // 14. INITIALIZE PAYSTACK
    // --------------------------------------------------
    const paystackResponse =
      await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${secretKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email:
              order.User?.email,

            amount:
              amountInKobo,

            currency:
              "NGN",

            reference,

            callback_url:
              callbackUrl,

            metadata: {
              orderId:
                order.id,

              orderNumber:
                order.orderNumber,

              paymentId:
                payment.id,

              customerId:
                sessionUser.userId,

              customerName,
            },
          }),
        }
      );

    // --------------------------------------------------
    // 15. READ PAYSTACK RESPONSE
    // --------------------------------------------------
    const paystackData =
      await paystackResponse.json();

    console.log(
      "PAYSTACK RESPONSE:",
      paystackData
    );

    // --------------------------------------------------
    // 16. CHECK PAYSTACK RESULT
    // --------------------------------------------------
    if (
      !paystackResponse.ok ||
      !paystackData.status
    ) {
      console.error(
        "PAYSTACK INITIALIZATION ERROR:",
        paystackData
      );

      return NextResponse.json(
        {
          success: false,

          message:
            paystackData.message ||
            "Unable to initialize Paystack payment.",
        },

        {
          status:
            paystackResponse.status ||
            400,
        }
      );
    }

    // --------------------------------------------------
    // 17. UPDATE PAYMENT
    // --------------------------------------------------
    await prisma.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        reference:
          paystackData.data
            ?.reference ||
          reference,

        status:
          "PROCESSING",

        updatedAt:
          new Date(),
      },
    });

    // --------------------------------------------------
    // 18. RETURN PAYSTACK AUTHORIZATION
    // --------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        authorizationUrl:
          paystackData.data
            ?.authorization_url,

        accessCode:
          paystackData.data
            ?.access_code,

        reference:
          paystackData.data
            ?.reference ||
          reference,
      },

      { status: 200 }
    );
  } catch (error) {
    // --------------------------------------------------
    // 19. ERROR HANDLING
    // --------------------------------------------------
    console.error(
      "PAYSTACK INITIALIZE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to initialize payment.",
      },

      { status: 500 }
    );
  }
}