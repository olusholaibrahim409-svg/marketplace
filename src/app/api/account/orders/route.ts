import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

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
            "Only customer accounts can view customer orders.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. GET CUSTOMER ORDERS
    // --------------------------------------------------
    const orders =
      await prisma.order.findMany({
        where: {
          userId:
            sessionUser.userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          // Order items
          OrderItem: {
            include: {
              // Product for each order item
              Product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,

                  // Product images
                  ProductImage: {
                    take: 1,

                    orderBy: {
                      createdAt: "asc",
                    },

                    select: {
                      url: true,
                    },
                  },
                },
              },
            },
          },

          // Payment
          Payment: true,

          // Delivery address
          Address: true,
        },
      });

    // --------------------------------------------------
    // 4. FORMAT RESPONSE
    // --------------------------------------------------
    return NextResponse.json({
      success: true,

      orders: orders.map(
        (order) => ({
          id: order.id,

          orderNumber:
            order.orderNumber,

          status:
            order.status,

          subtotal:
            Number(order.subtotal),

          shippingFee:
            Number(order.shippingFee),

          discount:
            Number(order.discount),

          total:
            Number(order.total),

          createdAt:
            order.createdAt,

          // ------------------------------------------------
          // PAYMENT
          // ------------------------------------------------
          payment: order.Payment
            ? {
                reference:
                  order.Payment.reference,

                method:
                  order.Payment.method,

                status:
                  order.Payment.status,
              }
            : null,

          // ------------------------------------------------
          // ADDRESS
          // ------------------------------------------------
          address:
            order.Address
              ? {
                  firstName:
                    order.Address
                      .firstName,

                  lastName:
                    order.Address
                      .lastName,

                  phone:
                    order.Address.phone,

                  addressLine1:
                    order.Address
                      .addressLine1,

                  city:
                    order.Address.city,

                  state:
                    order.Address.state,

                  country:
                    order.Address.country,
                }
              : null,

          // ------------------------------------------------
          // ORDER ITEMS
          // ------------------------------------------------
          items:
            order.OrderItem.map(
              (item) => ({
                id: item.id,

                productId:
                  item.productId,

                productName:
                  item.productName,

                quantity:
                  item.quantity,

                unitPrice:
                  Number(
                    item.unitPrice
                  ),

                totalPrice:
                  Number(
                    item.totalPrice
                  ),

                product:
                  item.Product
                    ? {
                        id:
                          item.Product
                            .id,

                        name:
                          item.Product
                            .name,

                        slug:
                          item.Product
                            .slug,

                        image:
                          item.Product
                            .ProductImage[0]
                            ?.url ||
                          null,
                      }
                    : null,
              })
            ),
        })
      ),
    });
  } catch (error) {
    // --------------------------------------------------
    // 5. ERROR HANDLING
    // --------------------------------------------------
    console.error(
      "CUSTOMER ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load your orders.",
      },
      { status: 500 }
    );
  }
}