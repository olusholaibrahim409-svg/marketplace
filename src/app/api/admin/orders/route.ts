import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const allowedStatuses = [
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

export async function GET() {
  try {
    // --------------------------------------------------
    // 1. CHECK LOGIN
    // --------------------------------------------------
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. CHECK ADMIN ACCESS
    // --------------------------------------------------
    if (
      sessionUser.role !== "ADMIN" &&
      sessionUser.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. GET ALL ORDERS
    // --------------------------------------------------
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        // ------------------------------------------------
        // CUSTOMER
        // ------------------------------------------------
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },

        // ------------------------------------------------
        // SHIPPING ADDRESS
        // ------------------------------------------------
        Address: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            country: true,
          },
        },

        // ------------------------------------------------
        // PAYMENT
        // ------------------------------------------------
        Payment: {
          select: {
            id: true,
            reference: true,
            amount: true,
            method: true,
            status: true,
            paidAt: true,
          },
        },

        // ------------------------------------------------
        // SHIPMENT
        // ------------------------------------------------
        Shipment: {
          select: {
            id: true,
            trackingNumber: true,
            courier: true,
            status: true,
            shippedAt: true,
            deliveredAt: true,
          },
        },

        // ------------------------------------------------
        // ORDER ITEMS
        // ------------------------------------------------
        OrderItem: {
          include: {
            Product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sellerId: true,

                Seller: {
                  select: {
                    id: true,
                    storeName: true,
                    status: true,
                  },
                },

                Category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },

                ProductImage: {
                  orderBy: {
                    sortOrder: "asc",
                  },

                  take: 1,

                  select: {
                    id: true,
                    url: true,
                    altText: true,
                  },
                },
              },
            },

            ProductVariant: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                stockQuantity: true,
                attributes: true,
              },
            },
          },
        },

        // ------------------------------------------------
        // COMMISSION
        // ------------------------------------------------
        Commission: {
          select: {
            id: true,
            rate: true,
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    // --------------------------------------------------
    // 4. FORMAT ORDERS
    // --------------------------------------------------
    const formattedOrders = orders.map((order) => {
      const items = order.OrderItem;

      const subtotal = items.reduce(
        (sum, item) =>
          sum + Number(item.totalPrice),
        0
      );

      const quantity = items.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

      const commission = order.Commission
        ? Number(order.Commission.amount)
        : 0;

      const earnings = subtotal - commission;

      return {
        id: order.id,

        orderNumber: order.orderNumber,

        status: order.status,

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,

        customer: order.User
          ? {
              id: order.User.id,
              firstName: order.User.firstName,
              lastName: order.User.lastName,
              email: order.User.email,
              phone: order.User.phone,
            }
          : null,

        shippingAddress: order.Address
          ? {
              id: order.Address.id,
              firstName: order.Address.firstName,
              lastName: order.Address.lastName,
              phone: order.Address.phone,
              addressLine1:
                order.Address.addressLine1,
              addressLine2:
                order.Address.addressLine2,
              city: order.Address.city,
              state: order.Address.state,
              country: order.Address.country,
            }
          : null,

        payment: order.Payment
          ? {
              id: order.Payment.id,
              reference:
                order.Payment.reference,
              amount: Number(
                order.Payment.amount
              ),
              method: order.Payment.method,
              status: order.Payment.status,
              paidAt: order.Payment.paidAt,
            }
          : null,

        shipment: order.Shipment
          ? {
              id: order.Shipment.id,
              trackingNumber:
                order.Shipment.trackingNumber,
              courier: order.Shipment.courier,
              status: order.Shipment.status,
              shippedAt:
                order.Shipment.shippedAt,
              deliveredAt:
                order.Shipment.deliveredAt,
            }
          : null,

        items: items.map((item) => ({
          id: item.id,

          productId: item.productId,

          productName: item.productName,

          quantity: item.quantity,

          unitPrice: Number(
            item.unitPrice
          ),

          totalPrice: Number(
            item.totalPrice
          ),

          variant: item.ProductVariant
            ? {
                id:
                  item.ProductVariant.id,
                name:
                  item.ProductVariant.name,
                sku:
                  item.ProductVariant.sku,
                price:
                  item.ProductVariant
                    .price !== null
                    ? Number(
                        item.ProductVariant
                          .price
                      )
                    : null,
                stockQuantity:
                  item.ProductVariant
                    .stockQuantity,
                attributes:
                  item.ProductVariant
                    .attributes,
              }
            : null,

          product: {
            id: item.Product.id,

            name: item.Product.name,

            slug: item.Product.slug,

            sellerId:
              item.Product.sellerId,

            seller:
              item.Product.Seller
                ? {
                    id:
                      item.Product.Seller
                        .id,
                    storeName:
                      item.Product.Seller
                        .storeName,
                    status:
                      item.Product.Seller
                        .status,
                  }
                : null,

            category:
              item.Product.Category
                ? {
                    id:
                      item.Product.Category
                        .id,
                    name:
                      item.Product.Category
                        .name,
                  }
                : null,

            image:
              item.Product
                .ProductImage[0]?.url ??
              null,
          },
        })),

        summary: {
          itemCount: items.length,
          quantity,
          subtotal,
          commission,
          earnings,
        },

        commission: order.Commission
          ? {
              rate: Number(
                order.Commission.rate
              ),
              amount: Number(
                order.Commission.amount
              ),
            }
          : null,
      };
    });

    // --------------------------------------------------
    // 5. MARKETPLACE SUMMARY
    // --------------------------------------------------
    const totalOrders =
      formattedOrders.length;

    const totalSales =
      formattedOrders.reduce(
        (sum, order) =>
          sum + order.summary.subtotal,
        0
      );

    const totalCommission =
      formattedOrders.reduce(
        (sum, order) =>
          sum + order.summary.commission,
        0
      );

    const pendingOrders =
      formattedOrders.filter(
        (order) =>
          order.status === "PENDING" ||
          order.status === "CONFIRMED" ||
          order.status === "PROCESSING"
      ).length;

    const deliveredOrders =
      formattedOrders.filter(
        (order) =>
          order.status === "DELIVERED"
      ).length;

    return NextResponse.json({
      success: true,

      orders: formattedOrders,

      count: formattedOrders.length,

      summary: {
        totalOrders,
        totalSales,
        totalCommission,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load admin orders.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export async function PATCH(
  request: NextRequest
) {
  try {
    // --------------------------------------------------
    // 1. CHECK LOGIN
    // --------------------------------------------------
    const sessionUser =
      await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. CHECK ADMIN ACCESS
    // --------------------------------------------------
    if (
      sessionUser.role !== "ADMIN" &&
      sessionUser.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. READ REQUEST
    // --------------------------------------------------
    const body = await request.json();

    const orderId = body.orderId;
    const status = body.status;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order status.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 4. CHECK ORDER
    // --------------------------------------------------
    const existingOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        select: {
          id: true,
          orderNumber: true,
          status: true,
        },
      });

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // 5. UPDATE ORDER
    // --------------------------------------------------
    const order =
      await prisma.order.update({
        where: {
          id: orderId,
        },

        data: {
          status,
          updatedAt: new Date(),
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

      message:
        "Order status updated successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "ADMIN ORDER STATUS UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update order status.",
      },
      { status: 500 }
    );
  }
}