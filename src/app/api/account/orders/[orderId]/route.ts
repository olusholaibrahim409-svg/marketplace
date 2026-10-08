import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ orderId: string }>;
  }
) {
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

    if (sessionUser.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customer accounts can view orders.",
        },
        { status: 403 }
      );
    }

    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: sessionUser.userId,
      },

      include: {
        address: true,

        payment: true,

        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    sortOrder: "asc",
                  },

                  select: {
                    id: true,
                    url: true,
                    altText: true,
                    sortOrder: true,
                  },
                },

                seller: {
                  select: {
                    id: true,
                    storeName: true,
                    status: true,
                  },
                },
              },
            },

            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    const formattedOrder = {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      createdAt: order.createdAt,

      subtotal: Number(order.subtotal),

      shippingFee: Number(order.shippingFee),

      discount: Number(order.discount),

      total: Number(order.total),

      address: {
        id: order.address.id,

        firstName: order.address.firstName,

        lastName: order.address.lastName,

        phone: order.address.phone,

        addressLine1: order.address.addressLine1,

        addressLine2: order.address.addressLine2,

        city: order.address.city,

        state: order.address.state,

        country: order.address.country,
      },

      payment: order.payment
        ? {
            id: order.payment.id,

            reference: order.payment.reference,

            amount: Number(order.payment.amount),

            method: order.payment.method,

            status: order.payment.status,

            provider: order.payment.provider,

            paidAt: order.payment.paidAt,
          }
        : null,

      items: order.items.map((item) => ({
        id: item.id,

        quantity: item.quantity,

        price: Number(item.unitPrice),

        product: {
          id: item.product.id,

          name: item.product.name,

          slug: item.product.slug,

          image:
            item.product.images.length > 0
              ? item.product.images[0].url
              : "/placeholder-product.jpg",

          images: item.product.images.map(
            (image) => ({
              id: image.id,

              url: image.url,

              altText: image.altText,

              sortOrder: image.sortOrder,
            })
          ),

          seller: item.product.seller
            ? {
                id: item.product.seller.id,

                storeName:
                  item.product.seller.storeName,

                status:
                  item.product.seller.status,
              }
            : null,
        },

        variant: item.variant
          ? {
              id: item.variant.id,

              name: item.variant.name,

              sku: item.variant.sku,
            }
          : null,
      })),
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error(
      "GET ORDER DETAILS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load order details.",
      },
      { status: 500 }
    );
  }
}