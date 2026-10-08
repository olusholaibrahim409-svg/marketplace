import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

type OrderItemInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

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
          message: "Please login before placing an order.",
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
          message: "Only customer accounts can place orders.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 3. READ REQUEST BODY
    // --------------------------------------------------
    const body = await request.json();

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const addressLine1 =
      typeof body.addressLine1 === "string"
        ? body.addressLine1.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";

    const paymentMethod = body.paymentMethod;

    const items: OrderItemInput[] = Array.isArray(body.items)
      ? body.items
      : [];

    // --------------------------------------------------
    // 4. VALIDATE CUSTOMER INFORMATION
    // --------------------------------------------------
    if (
      !fullName ||
      !email ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Full name, email, phone, address, city and state are required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 5. VALIDATE CART
    // --------------------------------------------------
    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. VALIDATE PAYMENT METHOD
    // --------------------------------------------------
    if (
      paymentMethod !== "PAYSTACK" &&
      paymentMethod !== "CASH_ON_DELIVERY"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 7. VALIDATE CART ITEMS
    // --------------------------------------------------
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid cart item.",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // 8. GET PRODUCTS
    // --------------------------------------------------
    const productIds = [
      ...new Set(
        items.map((item) => item.productId)
      ),
    ];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        status: "APPROVED",
      },

      include: {
        Inventory: true,

        ProductVariant: true,

        Seller: {
          select: {
            id: true,
            storeName: true,
            status: true,
          },
        },
      },
    });

    // --------------------------------------------------
    // 9. MAKE SURE ALL PRODUCTS EXIST
    // --------------------------------------------------
    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more products in your cart are no longer available.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 10. VALIDATE PRODUCTS, VARIANTS AND STOCK
    // --------------------------------------------------
    const validatedItems: {
      productId: string;
      variantId: string | null;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      sellerId: string;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      const product = products.find(
        (currentProduct) =>
          currentProduct.id === item.productId
      );

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A product in your cart could not be found.",
          },
          { status: 400 }
        );
      }

      // ------------------------------------------------
      // CHECK SELLER
      // ------------------------------------------------
      if (product.Seller.status !== "APPROVED") {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} is currently unavailable.`,
          },
          { status: 400 }
        );
      }

      let unitPrice = Number(product.price);

      let availableStock =
        product.Inventory?.quantity ??
        product.stockQuantity;

      let variantId: string | null = null;

      // ------------------------------------------------
      // HANDLE VARIANT
      // ------------------------------------------------
      if (item.variantId) {
        const variant =
          product.ProductVariant.find(
            (currentVariant) =>
              currentVariant.id === item.variantId
          );

        if (!variant) {
          return NextResponse.json(
            {
              success: false,
              message:
                `The selected variant for ${product.name} is no longer available.`,
            },
            { status: 400 }
          );
        }

        variantId = variant.id;

        if (variant.price !== null) {
          unitPrice = Number(variant.price);
        }

        availableStock =
          variant.stockQuantity;

        // A variant product must have a valid
        // variant stock amount.
        if (availableStock <= 0) {
          return NextResponse.json(
            {
              success: false,
              message:
                `${product.name} — ${variant.name} is out of stock.`,
            },
            { status: 400 }
          );
        }
      }

      // ------------------------------------------------
      // CHECK STOCK
      // ------------------------------------------------
      if (availableStock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: item.variantId
              ? `Only ${availableStock} unit(s) of the selected ${product.name} option are available.`
              : `Only ${availableStock} unit(s) of ${product.name} are available.`,
          },
          { status: 400 }
        );
      }

      // ------------------------------------------------
      // CALCULATE ITEM TOTAL
      // ------------------------------------------------
      const totalPrice =
        unitPrice * item.quantity;

      subtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        variantId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        sellerId: product.sellerId,
      });
    }

    // --------------------------------------------------
    // 11. CALCULATE ORDER TOTAL
    // --------------------------------------------------
    const shippingFee =
      subtotal > 0 ? 2500 : 0;

    const discount = 0;

    const total =
      subtotal +
      shippingFee -
      discount;

    // --------------------------------------------------
    // 12. GENERATE ORDER NUMBER
    // --------------------------------------------------
    const orderNumber =
      `ORD-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    // --------------------------------------------------
    // 13. DATABASE TRANSACTION
    // --------------------------------------------------
    const result = await prisma.$transaction(
      async (tx) => {
        const now = new Date();

        // ==================================================
        // RE-CHECK AND RESERVE/DEDUCT STOCK
        //
        // This happens inside the transaction so that
        // another customer cannot successfully purchase
        // the same last unit at the same time.
        // ==================================================
        for (const item of validatedItems) {
          if (item.variantId) {
            // ----------------------------------------------
            // VARIANT STOCK
            // ----------------------------------------------
            const variantUpdate =
              await tx.productVariant.updateMany({
                where: {
                  id: item.variantId,
                  productId: item.productId,
                  stockQuantity: {
                    gte: item.quantity,
                  },
                },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                  updatedAt: now,
                },
              });

            if (variantUpdate.count !== 1) {
              throw new Error(
                `The selected variant for ${item.productName} is no longer available in the requested quantity.`
              );
            }

            // ----------------------------------------------
            // PRODUCT TOTAL STOCK
            // ----------------------------------------------
            const productUpdate =
              await tx.product.updateMany({
                where: {
                  id: item.productId,
                  stockQuantity: {
                    gte: item.quantity,
                  },
                },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                  updatedAt: now,
                },
              });

            if (productUpdate.count !== 1) {
              throw new Error(
                `${item.productName} no longer has enough total stock.`
              );
            }

            // ----------------------------------------------
            // INVENTORY STOCK
            // ----------------------------------------------
            if (
              products.find(
                (product) =>
                  product.id === item.productId
              )?.Inventory
            ) {
              const inventoryUpdate =
                await tx.inventory.updateMany({
                  where: {
                    productId: item.productId,
                    quantity: {
                      gte: item.quantity,
                    },
                  },
                  data: {
                    quantity: {
                      decrement: item.quantity,
                    },
                    updatedAt: now,
                  },
                });

              if (inventoryUpdate.count !== 1) {
                throw new Error(
                  `${item.productName} inventory is no longer available in the requested quantity.`
                );
              }
            }
          } else {
            // ----------------------------------------------
            // NORMAL PRODUCT STOCK
            // ----------------------------------------------
            const productUpdate =
              await tx.product.updateMany({
                where: {
                  id: item.productId,
                  stockQuantity: {
                    gte: item.quantity,
                  },
                },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                  updatedAt: now,
                },
              });

            if (productUpdate.count !== 1) {
              throw new Error(
                `${item.productName} is no longer available in the requested quantity.`
              );
            }

            // ----------------------------------------------
            // INVENTORY STOCK
            // ----------------------------------------------
            if (
              products.find(
                (product) =>
                  product.id === item.productId
              )?.Inventory
            ) {
              const inventoryUpdate =
                await tx.inventory.updateMany({
                  where: {
                    productId: item.productId,
                    quantity: {
                      gte: item.quantity,
                    },
                  },
                  data: {
                    quantity: {
                      decrement: item.quantity,
                    },
                    updatedAt: now,
                  },
                });

              if (inventoryUpdate.count !== 1) {
                throw new Error(
                  `${item.productName} inventory is no longer available in the requested quantity.`
                );
              }
            }
          }
        }

        // ==================================================
        // CREATE ADDRESS
        // ==================================================
        const address =
          await tx.address.create({
            data: {
              id: randomUUID(),

              userId:
                sessionUser.userId,

              firstName:
                fullName.split(" ")[0] ||
                fullName,

              lastName:
                fullName
                  .split(" ")
                  .slice(1)
                  .join(" ") || "",

              phone,

              addressLine1,

              city,

              state,

              country: "Nigeria",

              isDefault: false,

              updatedAt: now,
            },
          });

        // ==================================================
        // DETERMINE SELLER
        // ==================================================
        const sellerIds = [
          ...new Set(
            validatedItems.map(
              (item) =>
                item.sellerId
            )
          ),
        ];

        const sellerId =
          sellerIds.length === 1
            ? sellerIds[0]
            : null;

        // ==================================================
        // CREATE ORDER
        // ==================================================
        const order =
          await tx.order.create({
            data: {
              id: randomUUID(),

              orderNumber,

              userId:
                sessionUser.userId,

              sellerId,

              addressId:
                address.id,

              status: "PENDING",

              subtotal,

              shippingFee,

              discount,

              total,

              updatedAt: now,
            },
          });

        // ==================================================
        // CREATE ORDER ITEMS
        // ==================================================
        await tx.orderItem.createMany({
          data: validatedItems.map(
            (item) => ({
              id: randomUUID(),

              orderId:
                order.id,

              productId:
                item.productId,

              variantId:
                item.variantId,

              productName:
                item.productName,

              quantity:
                item.quantity,

              unitPrice:
                item.unitPrice,

              totalPrice:
                item.totalPrice,
            })
          ),
        });

        // ==================================================
        // CREATE PAYMENT
        // ==================================================
        const paymentReference =
          `${orderNumber}-PAY`;

        const payment =
          await tx.payment.create({
            data: {
              id: randomUUID(),

              orderId:
                order.id,

              reference:
                paymentReference,

              amount:
                total,

              method:
                paymentMethod ===
                "PAYSTACK"
                  ? "PAYSTACK"
                  : "CASH_ON_DELIVERY",

              status: "PENDING",

              provider:
                paymentMethod ===
                "PAYSTACK"
                  ? "Paystack"
                  : "Marketplace",

              updatedAt: now,
            },
          });

        return {
          order,
          payment,
          address,
        };
      }
    );

    // --------------------------------------------------
    // 14. RETURN SUCCESS
    // --------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id:
            result.order.id,

          orderNumber:
            result.order.orderNumber,

          status:
            result.order.status,

          subtotal:
            Number(
              result.order.subtotal
            ),

          shippingFee:
            Number(
              result.order.shippingFee
            ),

          discount:
            Number(
              result.order.discount
            ),

          total:
            Number(
              result.order.total
            ),
        },

        payment: {
          id:
            result.payment.id,

          reference:
            result.payment.reference,

          method:
            result.payment.method,

          status:
            result.payment.status,
        },
      },

      { status: 201 }
    );
  } catch (error) {
    // --------------------------------------------------
    // 15. ERROR HANDLING
    // --------------------------------------------------
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },

      { status: 500 }
    );
  }
}