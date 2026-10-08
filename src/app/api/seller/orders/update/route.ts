import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const allowedTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
};

export async function PATCH(request: Request) {
  try {
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

    if (sessionUser.role !== "SELLER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only seller accounts can update orders.",
        },
        { status: 403 }
      );
    }

    const seller = await prisma.seller.findUnique({
      where: {
        userId: sessionUser.userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller account not found.",
        },
        { status: 404 }
      );
    }

    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message: "Your seller account is not approved.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const orderId = body.orderId;
    const newStatus = body.status;

    if (
      typeof orderId !== "string" ||
      typeof newStatus !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID and status are required.",
        },
        { status: 400 }
      );
    }

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
      "REFUNDED",
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,

        items: {
          some: {
            product: {
              sellerId: seller.id,
            },
          },
        },
      },

      select: {
        id: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or does not belong to your products.",
        },
        { status: 404 }
      );
    }

    const currentStatus = order.status;

    if (currentStatus === newStatus) {
      return NextResponse.json(
        {
          success: false,
          message: `Order is already ${newStatus}.`,
        },
        { status: 400 }
      );
    }

    const allowedNextStatuses =
      allowedTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `You cannot change an order from ${currentStatus} to ${newStatus}.`,
        },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: newStatus as
          | "PENDING"
          | "CONFIRMED"
          | "PROCESSING"
          | "SHIPPED"
          | "OUT_FOR_DELIVERY"
          | "DELIVERED"
          | "CANCELLED"
          | "RETURNED"
          | "REFUNDED",
      },

      select: {
        id: true,
        orderNumber: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("SELLER ORDER UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update order status.",
      },
      { status: 500 }
    );
  }
}