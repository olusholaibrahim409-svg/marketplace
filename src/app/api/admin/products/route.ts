import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Seller: {
          select: {
            id: true,
            storeName: true,
          },
        },

        Category: {
          select: {
            id: true,
            name: true,
          },
        },

        Brand: {
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
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("ADMIN PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load products.",
      },
      { status: 500 }
    );
  }
}

/**
 * CREATE PRODUCT
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const price = Number(body.price);

    const compareAtPrice =
      body.compareAtPrice === "" ||
      body.compareAtPrice === null ||
      body.compareAtPrice === undefined
        ? null
        : Number(body.compareAtPrice);

    const sku =
      typeof body.sku === "string" &&
      body.sku.trim()
        ? body.sku.trim()
        : null;

    const sellerId =
      typeof body.sellerId === "string"
        ? body.sellerId.trim()
        : "";

    const categoryId =
      typeof body.categoryId === "string"
        ? body.categoryId.trim()
        : "";

    const brandId =
      typeof body.brandId === "string" &&
      body.brandId.trim()
        ? body.brandId.trim()
        : null;

    const stockQuantity =
      Number.isInteger(Number(body.stockQuantity))
        ? Number(body.stockQuantity)
        : 0;

    const isFeatured =
      Boolean(body.isFeatured);

    const isFlashSale =
      Boolean(body.isFlashSale);

    const status =
      body.status === "APPROVED" ||
      body.status === "REJECTED" ||
      body.status === "PENDING"
        ? body.status
        : "APPROVED";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product price must be greater than zero.",
        },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) ||
        compareAtPrice < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Compare-at price is invalid.",
        },
        { status: 400 }
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller is required.",
        },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required.",
        },
        { status: 400 }
      );
    }

    if (stockQuantity < 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stock quantity cannot be negative.",
        },
        { status: 400 }
      );
    }

    const seller =
      await prisma.seller.findUnique({
        where: {
          id: sellerId,
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
          message: "Seller not found.",
        },
        { status: 404 }
      );
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    if (brandId) {
      const brand =
        await prisma.brand.findUnique({
          where: {
            id: brandId,
          },
          select: {
            id: true,
          },
        });

      if (!brand) {
        return NextResponse.json(
          {
            success: false,
            message: "Brand not found.",
          },
          { status: 404 }
        );
      }
    }

    if (sku) {
      const existingSku =
        await prisma.product.findUnique({
          where: {
            sku,
          },
          select: {
            id: true,
          },
        });

      if (existingSku) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A product with this SKU already exists.",
          },
          { status: 409 }
        );
      }
    }

    const productId = randomUUID();
    const now = new Date();

    const product =
      await prisma.$transaction(
        async (tx) => {
          const createdProduct =
            await tx.product.create({
              data: {
                id: productId,
                sellerId,
                categoryId,
                brandId,
                name,
                slug: `${name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")}-${productId.slice(
                  0,
                  8
                )}`,
                description:
                  description || null,
                sku,
                price,
                compareAtPrice,
                status,
                isFeatured,
                isFlashSale,
                stockQuantity,
                updatedAt: now,
              },

              include: {
                Seller: {
                  select: {
                    id: true,
                    storeName: true,
                  },
                },

                Category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },

                Brand: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            });

          await tx.inventory.create({
            data: {
              id: randomUUID(),
              productId: createdProduct.id,
              quantity: stockQuantity,
              reserved: 0,
              updatedAt: now,
            },
          });

          return createdProduct;
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN PRODUCT CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create product.",
      },
      { status: 500 }
    );
  }
}

/**
 * UPDATE PRODUCT STATUS
 */
export async function PATCH(
  request: NextRequest
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const productId = body.productId;
    const status = body.status;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    if (
      status !== "APPROVED" &&
      status !== "REJECTED" &&
      status !== "PENDING"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid product status. Use APPROVED, REJECTED or PENDING.",
        },
        { status: 400 }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },

        select: {
          id: true,
          name: true,
          status: true,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          status,
          updatedAt: new Date(),
        },

        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: `Product ${status.toLowerCase()} successfully.`,
      product,
    });
  } catch (error) {
    console.error(
      "ADMIN PRODUCT STATUS UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update product status.",
      },
      { status: 500 }
    );
  }
}