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
          message: "Please login.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. FIND SELLER
    // --------------------------------------------------
    const seller = await prisma.seller.findUnique({
      where: {
        userId: sessionUser.userId,
      },

      select: {
        id: true,
        storeName: true,
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

    // --------------------------------------------------
    // 3. CHECK SELLER APPROVAL
    // --------------------------------------------------
    if (seller.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your seller account is not approved.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 4. FIND ORDERS CONTAINING SELLER PRODUCTS
    // --------------------------------------------------
    const orders = await prisma.order.findMany({
      where: {
        OrderItem: {
          some: {
            Product: {
              sellerId: seller.id,
            },
          },
        },
      },

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
        // SELLER ORDER ITEMS
        // ------------------------------------------------
        OrderItem: {
          where: {
            Product: {
              sellerId: seller.id,
            },
          },

          include: {
            // --------------------------------------------
            // PRODUCT
            // --------------------------------------------
            Product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sellerId: true,

                // ----------------------------------------
                // PRODUCT IMAGE
                // ----------------------------------------
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

            // --------------------------------------------
            // PRODUCT VARIANT
            // --------------------------------------------
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
    // 5. FORMAT ORDERS
    // --------------------------------------------------
    const formattedOrders = orders.map(
      (order) => {
        const sellerItems =
          order.OrderItem;

        // ----------------------------------------------
        // SELLER SUBTOTAL
        // ----------------------------------------------
        const sellerSubtotal =
          sellerItems.reduce(
            (sum, item) =>
              sum +
              Number(item.totalPrice),
            0
          );

        // ----------------------------------------------
        // TOTAL QUANTITY
        // ----------------------------------------------
        const sellerQuantity =
          sellerItems.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          );

        // ----------------------------------------------
        // COMMISSION
        // ----------------------------------------------
        const sellerCommission =
          order.Commission
            ? Number(
                order.Commission.amount
              )
            : 0;

        // ----------------------------------------------
        // SELLER EARNINGS
        // ----------------------------------------------
        const sellerEarnings =
          sellerSubtotal -
          sellerCommission;

        return {
          id: order.id,

          orderNumber:
            order.orderNumber,

          status:
            order.status,

          createdAt:
            order.createdAt,

          updatedAt:
            order.updatedAt,

          // ==========================================
          // CUSTOMER
          // ==========================================
          customer: {
            id:
              order.User.id,

            firstName:
              order.User.firstName,

            lastName:
              order.User.lastName,

            email:
              order.User.email,

            phone:
              order.User.phone,
          },

          // ==========================================
          // SHIPPING ADDRESS
          // ==========================================
          shippingAddress: {
            id:
              order.Address.id,

            firstName:
              order.Address.firstName,

            lastName:
              order.Address.lastName,

            phone:
              order.Address.phone,

            addressLine1:
              order.Address.addressLine1,

            addressLine2:
              order.Address.addressLine2,

            city:
              order.Address.city,

            state:
              order.Address.state,

            country:
              order.Address.country,
          },

          // ==========================================
          // PAYMENT
          // ==========================================
          payment:
            order.Payment
              ? {
                  id:
                    order.Payment.id,

                  reference:
                    order.Payment
                      .reference,

                  amount:
                    Number(
                      order.Payment
                        .amount
                    ),

                  method:
                    order.Payment
                      .method,

                  status:
                    order.Payment
                      .status,

                  paidAt:
                    order.Payment
                      .paidAt,
                }
              : null,

          // ==========================================
          // SHIPMENT
          // ==========================================
          shipment:
            order.Shipment
              ? {
                  id:
                    order.Shipment.id,

                  trackingNumber:
                    order.Shipment
                      .trackingNumber,

                  courier:
                    order.Shipment.courier,

                  status:
                    order.Shipment
                      .status,

                  shippedAt:
                    order.Shipment
                      .shippedAt,

                  deliveredAt:
                    order.Shipment
                      .deliveredAt,
                }
              : null,

          // ==========================================
          // SELLER ITEMS
          // ==========================================
          items:
            sellerItems.map(
              (item) => ({
                id:
                  item.id,

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

                variant:
                  item.ProductVariant
                    ? {
                        id:
                          item
                            .ProductVariant
                            .id,

                        name:
                          item
                            .ProductVariant
                            .name,

                        sku:
                          item
                            .ProductVariant
                            .sku,

                        price:
                          item
                            .ProductVariant
                            .price !==
                          null
                            ? Number(
                                item
                                  .ProductVariant
                                  .price
                              )
                            : null,

                        stockQuantity:
                          item
                            .ProductVariant
                            .stockQuantity,

                        attributes:
                          item
                            .ProductVariant
                            .attributes,
                      }
                    : null,

                product: {
                  id:
                    item.Product.id,

                  name:
                    item.Product.name,

                  slug:
                    item.Product.slug,

                  image:
                    item.Product
                      .ProductImage[0]
                      ?.url ??
                    null,
                },
              })
            ),

          // ==========================================
          // SELLER SUMMARY
          // ==========================================
          summary: {
            itemCount:
              sellerItems.length,

            quantity:
              sellerQuantity,

            subtotal:
              sellerSubtotal,

            commission:
              sellerCommission,

            earnings:
              sellerEarnings,
          },

          // ==========================================
          // COMMISSION
          // ==========================================
          commission:
            order.Commission
              ? {
                  rate:
                    Number(
                      order.Commission
                        .rate
                    ),

                  amount:
                    Number(
                      order.Commission
                        .amount
                    ),
                }
              : null,
        };
      }
    );

    // --------------------------------------------------
    // 6. RETURN SUCCESS
    // --------------------------------------------------
    return NextResponse.json({
      success: true,

      seller: {
        id: seller.id,

        storeName:
          seller.storeName,

        status:
          seller.status,
      },

      orders:
        formattedOrders,

      count:
        formattedOrders.length,
    });
  } catch (error) {
    // --------------------------------------------------
    // 7. ERROR HANDLING
    // --------------------------------------------------
    console.error(
      "SELLER ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to load seller orders.",
      },
      { status: 500 }
    );
  }
}