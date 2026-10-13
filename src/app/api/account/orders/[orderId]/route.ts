
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
        Address: true,
        Payment: true,
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImage: {
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
                Seller: {
                  select: {
                    id: true,
                    storeName: true,
                    status: true,
                  },
                },
              },
            },
            ProductVariant: {
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
        id: order.Address.id,
        firstName: order.Address.firstName,
        lastName: order.Address.lastName,
        phone: order.Address.phone,
        addressLine1: order.Address.addressLine1,
        addressLine2: order.Address.addressLine2,
        city: order.Address.city,
        state: order.Address.state,
        country: order.Address.country,
      },

      payment: order.Payment
        ? {
            id: order.Payment.id,
            reference: order.Payment.reference,
            amount: Number(order.Payment.amount),
            method: order.Payment.method,
            status: order.Payment.status,
            provider: order.Payment.provider,
            paidAt: order.Payment.paidAt,
          }
        : null,

      items: order.OrderItem.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.unitPrice),

        product: {
          id: item.Product.id,
          name: item.Product.name,
          slug: item.Product.slug,

          image:
            item.Product.ProductImage.length > 0
              ? item.Product.ProductImage[0].url
              : "/placeholder-product.jpg",

          images: item.Product.ProductImage.map(
            (image) => ({
              id: image.id,
              url: image.url,
              altText: image.altText,
              sortOrder: image.sortOrder,
            })
          ),

          seller: item.Product.Seller
            ? {
                id: item.Product.Seller.id,
                storeName: item.Product.Seller.storeName,
                status: item.Product.Seller.status,
              }
            : null,
        },

        variant: item.ProductVariant
          ? {
              id: item.ProductVariant.id,
              name: item.ProductVariant.name,
              sku: item.ProductVariant.sku,
            }
          : null,
      })),
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load order details.",
      },
      { status: 500 }
    );
  }
}
